<script lang='ts'>
	import { ArrowLeft, Send, AlertTriangle, Plus, Minus, CheckCircle } from "@lucide/svelte";
	import { walletAddress, privateKey } from '../../store/store';
	import { SolanaWalletService } from '$lib/helpers/solanaTransactions';
	import { formatWalletAddress } from "$lib/helpers/formatWalletAddress";
	import Toast from "$lib/components/ui/toast.svelte";
	import Dialog from "$lib/components/ui/dialog.svelte";
	import { Keypair } from '@solana/web3.js';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { SecurePasswordManager } from '$lib/helpers/securePasswordManager';
	import { authenticateUser } from '$lib/modules/storePassword';
	import * as bip39 from 'bip39';
	import { createKeyPairSignerFromPrivateKeyBytes } from '@solana/kit';
	import { SecureStorage } from '$lib/helpers/secureStorage';
	import pkg from 'crypto-js';

	const { AES, enc } = pkg;

	let address = $state('');
	let recipientAddress = $state('');
	let amount = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let success = $state('');
	let showConfirmation = $state(false);
	let showPasswordPrompt = $state(false);
	let password = $state('');
	let estimatedFee = $state(0);
	let balance = $state(0);
	let rpcUrl = $state<'mainnet' | 'testnet'>('mainnet');
	let pendingTransaction = $state<{keypair: Keypair, recipient: string, amount: number} | null>(null);
	let showSuccessDialog = $state(false);
	let successMessage = $state('');
	let transactionSignature = $state('');
	let showToast = $state(false);
	let toastMessage = $state('');
	let toastType = $state<'success' | 'error' | 'info'>('info');

	// Load saved network preference and wallet address on component mount
	$effect(() => {
		const savedNetwork = localStorage.getItem('selected-network') as 'mainnet' | 'testnet';
		if (savedNetwork && (savedNetwork === 'mainnet' || savedNetwork === 'testnet')) {
			rpcUrl = savedNetwork;
		}

		// Get wallet address directly from store or derive from private key
		const currentAddress = get(walletAddress);
		const storedPrivateKey = get(privateKey);
		
		if (currentAddress) {
			address = currentAddress;
			loadBalance();
		} else if (storedPrivateKey) {
			try {
				const privateKeyBytes = Uint8Array.from(Buffer.from(storedPrivateKey, 'hex'));
				const keypair = Keypair.fromSeed(privateKeyBytes);
				const derivedAddress = keypair.publicKey.toBase58();
				walletAddress.set(derivedAddress);
				address = derivedAddress;
				loadBalance();
			} catch (error) {
				console.error('Failed to derive address from private key:', error);
				checkAuthStatus();
			}
		} else {
			checkAuthStatus();
		}
	});

	async function checkAuthStatus() {
		try {
			const authStatus = await SecurePasswordManager.getAuthStatus();
			if (authStatus.hasWallet && !authStatus.isUnlocked) {
				error = 'Please sign in to your wallet to continue.';
			} else if (!authStatus.hasWallet) {
				error = 'No wallet found. Please create or import a wallet first.';
			}
		} catch (err) {
			console.error('Failed to check auth status:', err);
			error = 'Unable to check wallet status. Please try again.';
		}
	}

	let walletService = $derived(new SolanaWalletService(rpcUrl));

	// Toast helper function
	function showToastMessage(message: string, type: 'success' | 'error' | 'info' = 'info') {
		toastMessage = message;
		toastType = type;
		showToast = true;
	}

	// Auto-hide toast effect
	$effect(() => {
		if (showToast) {
			const timer = setTimeout(() => {
				showToast = false;
			}, 4000);
			return () => clearTimeout(timer);
		}
	});

	async function loadBalance() {
		try {
			balance = await walletService.getBalance(address);
		} catch (err) {
			console.error('Failed to load balance:', err);
		}
	}

	async function validateAndEstimate() {
		error = '';
		
		if (!recipientAddress.trim()) {
			error = 'Please enter a recipient address';
			return;
		}

		if (!SolanaWalletService.isValidAddress(recipientAddress.trim())) {
			error = 'Invalid Solana address';
			return;
		}

		if (!amount || parseFloat(amount) <= 0) {
			error = 'Please enter a valid amount';
			return;
		}

		const sendAmount = parseFloat(amount);
		if (sendAmount > balance) {
			error = 'Insufficient balance';
			return;
		}

		try {
			estimatedFee = await walletService.estimateTransactionFee(
				address,
				recipientAddress.trim(),
				sendAmount
			);

			if (sendAmount + estimatedFee > balance) {
				error = `Insufficient balance for amount + fee (${estimatedFee.toFixed(6)} SOL)`;
				return;
			}

			showConfirmation = true;
		} catch (err) {
			error = 'Failed to estimate transaction fee';
			console.error('Fee estimation error:', err);
		}
	}

	async function sendTransaction() {
		if (!showConfirmation) return;

		isLoading = true;
		error = '';
		success = '';
		
		try {
			// Check if we already have a private key
			let storedPrivateKey = get(privateKey);
			
			if (!storedPrivateKey) {
				// Need to authenticate to get the private key
				showPasswordPrompt = true;
				return;
			}

			// Create keypair and send transaction
			const privateKeyBytes = Uint8Array.from(Buffer.from(storedPrivateKey, 'hex'));
			const keypair = Keypair.fromSeed(privateKeyBytes);
			await executeTransaction(keypair);
			
		} catch (err) {
			error = err instanceof Error ? err.message : 'Transaction failed';
			console.error('Send transaction error:', err);
		} finally {
			isLoading = false;
		}
	}

	async function authenticateAndSend() {
		if (!password.trim()) {
			error = 'Please enter your password';
			return;
		}

		isLoading = true;
		error = '';

		try {
			console.log('Attempting authentication...');
			
			// Authenticate user and get private key
			const authResult = await authenticateUser(password);
			console.log('Authentication result:', authResult);
			
			if (!authResult) {
				error = 'Invalid password. Please check your password and try again.';
				return;
			}

			// Get the private key that was just set by authenticateUser
			const storedPrivateKey = get(privateKey);
			console.log('Private key retrieved:', storedPrivateKey ? 'success' : 'failed');
			
			if (!storedPrivateKey) {
				error = 'Failed to retrieve wallet key. Please try again.';
				return;
			}

			// Create keypair and send transaction
			const privateKeyBytes = Uint8Array.from(Buffer.from(storedPrivateKey, 'hex'));
			const keypair = Keypair.fromSeed(privateKeyBytes);
			
			// Hide password prompt and execute transaction
			showPasswordPrompt = false;
			password = '';
			
			await executeTransaction(keypair);
			
		} catch (err) {
			console.error('Authentication error:', err);
			
			// Provide more specific error messages
			if (err instanceof Error) {
				if (err.message.includes('Malformed UTF-8') || err.message.includes('UTF-8')) {
					error = 'Invalid password or corrupted wallet data. Please check your password.';
				} else if (err.message.includes('mnemonic') || err.message.includes('decrypt')) {
					error = 'Failed to decrypt wallet. Please check your password.';
				} else {
					error = err.message;
				}
			} else {
				error = 'Authentication failed. Please try again.';
			}
		} finally {
			isLoading = false;
		}
	}

	async function executeTransaction(keypair: Keypair) {
		try {
			// Show transaction status toast
			showToastMessage('Sending transaction...', 'info');
			
			const result = await walletService.sendSOL(
				keypair,
				recipientAddress.trim(),
				parseFloat(amount)
			);

			if (result.success) {
				// Show success dialog instead of toast
				successMessage = `Transaction sent successfully!`;
				transactionSignature = result.signature || '';
				showSuccessDialog = true;
				console.log('Transaction signature:', result.signature);
				
				// Show success toast notification
				showToastMessage('Transaction confirmed on blockchain!', 'success');
				
				// Reset form
				recipientAddress = '';
				amount = '';
				showConfirmation = false;
				
				// Refresh balance after successful transaction
				await loadBalance();
			} else {
				error = result.error || 'Transaction failed';
				showToastMessage('Transaction failed', 'error');
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Transaction execution failed';
			showToastMessage('Transaction failed', 'error');
			console.error('Transaction execution error:', err);
		}
	}

	function goBack() {
		window.history.back();
	}

	function resetForm() {
		showConfirmation = false;
		showPasswordPrompt = false;
		password = '';
		error = '';
		estimatedFee = 0;
	}

	// Number input controls
	function incrementAmount() {
		const currentAmount = parseFloat(amount) || 0;
		const increment = currentAmount < 1 ? 0.001 : currentAmount < 10 ? 0.01 : 0.1;
		const newAmount = currentAmount + increment;
		if (newAmount <= balance) {
			amount = newAmount.toFixed(6);
		}
	}

	function decrementAmount() {
		const currentAmount = parseFloat(amount) || 0;
		if (currentAmount <= 0) return;
		
		const increment = currentAmount <= 1 ? 0.001 : currentAmount <= 10 ? 0.01 : 0.1;
		const newAmount = Math.max(0, currentAmount - increment);
		amount = newAmount > 0 ? newAmount.toFixed(6) : '';
	}

	function setMaxAmount() {
		amount = balance.toFixed(6);
	}

	// Success dialog functions
	function closeSuccessDialog() {
		showSuccessDialog = false;
		transactionSignature = '';
	}

	function viewTransaction() {
		if (transactionSignature) {
			const explorerUrl = walletService.getExplorerUrl(transactionSignature);
			window.open(explorerUrl, '_blank');
		}
	}

	function goToWallet() {
		closeSuccessDialog();
		goto('/wallet');
	}
</script>

<style>
	/* Hide native number input spinners */
	input[type="number"]::-webkit-outer-spin-button,
	input[type="number"]::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	
	input[type="number"] {
		-moz-appearance: textfield;
		appearance: textfield;
	}

	/* Custom scrollbar styling */
	.scrollable-content::-webkit-scrollbar {
		width: 6px;
	}
	
	.scrollable-content::-webkit-scrollbar-track {
		background: #1a1a1a;
		border-radius: 3px;
	}
	
	.scrollable-content::-webkit-scrollbar-thumb {
		background: #404040;
		border-radius: 3px;
		transition: background 0.2s ease;
	}
	
	.scrollable-content::-webkit-scrollbar-thumb:hover {
		background: #00ccba;
	}
	
	/* Firefox scrollbar */
	.scrollable-content {
		scrollbar-width: thin;
		scrollbar-color: #404040 #1a1a1a;
	}
</style>

<section class="h-[600px] max-h-[600px] overflow-hidden pt-3 pb-6 px-6 bg-[#101212] text-white relative">
	<!-- Header -->
	<div class="flex items-center gap-3 mb-5">
		<button onclick={goBack} class="p-1.5 hover:bg-[#202222] rounded-lg transition-colors">
			<ArrowLeft size="18" />
		</button>
		<h1 class="text-lg font-bold">Send SOL</h1>
		<div class="text-xs text-gray-400 capitalize">({rpcUrl})</div>
	</div>

	<div class="h-[calc(100%-4rem)] overflow-y-auto space-y-5 scrollable-content">
		<!-- Wallet Info Card -->
		<div class="bg-gradient-to-r from-[#202222] to-[#252525] rounded-xl p-4 border border-[#303030]">
			<div class="flex justify-between items-center mb-2">
				<span class="text-gray-400 text-sm">From</span>
				<span class="text-xs font-mono text-gray-300">{formatWalletAddress(address)}</span>
			</div>
			<div class="flex justify-between items-center">
				<span class="text-gray-400 text-sm">Balance</span>
				<div class="text-right">
					<span class="font-bold text-[#00ccba]">{balance.toFixed(6)}</span>
					<span class="text-gray-400 text-sm ml-1">SOL</span>
				</div>
			</div>
		</div>

		{#if !showConfirmation}
			<!-- Send Form -->
			<div class="space-y-5">
				<!-- Recipient Address -->
				<div class="space-y-2">
					<label for="recipient" class="block text-sm font-medium text-gray-300">Recipient Address</label>
					<input
						id="recipient"
						type="text"
						bind:value={recipientAddress}
						placeholder="Enter Solana address (e.g., 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM)"
						class="w-full p-3 bg-[#1a1a1a] border border-[#404040] rounded-xl focus:border-[#00ccba] focus:ring-1 focus:ring-[#00ccba] focus:outline-none text-white placeholder-gray-500 transition-all text-sm"
					/>
				</div>

				<!-- Amount Input with Controls -->
				<div class="space-y-2">
					<label for="amount" class="block text-sm font-medium text-gray-300">Amount</label>
					<div class="relative">
						<div class="flex items-center bg-[#1a1a1a] border border-[#404040] rounded-xl focus-within:border-[#00ccba] focus-within:ring-1 focus-within:ring-[#00ccba] transition-all">
							<!-- Decrement Button -->
							<button
								type="button"
								onclick={decrementAmount}
								disabled={!amount || parseFloat(amount || '0') <= 0}
								class="p-3 text-gray-400 hover:text-[#00ccba] disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
							>
								<Minus size="16" />
							</button>
							
							<!-- Amount Input -->
							<input
								id="amount"
								type="number"
								step="0.000001"
								min="0"
								max={balance}
								bind:value={amount}
								placeholder="0.000000"
								class="flex-1 px-2 py-3 bg-transparent border-0 focus:outline-none text-white text-center font-mono"
							/>
							
							<!-- Increment Button -->
							<button
								type="button"
								onclick={incrementAmount}
								disabled={balance <= 0 || parseFloat(amount || '0') >= balance}
								class="p-3 text-gray-400 hover:text-[#00ccba] disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
							>
								<Plus size="16" />
							</button>
						</div>
						
						<!-- SOL Label and MAX Button -->
						<div class="flex justify-between items-center mt-2">
							<span class="text-xs text-gray-500">SOL</span>
							<button
								type="button"
								onclick={setMaxAmount}
								class="text-[#00ccba] text-xs font-medium hover:text-[#00eeda] transition-colors px-2 py-1 rounded-md hover:bg-[#00ccba]/10"
							>
								MAX
							</button>
						</div>
					</div>
				</div>

				<!-- Quick Amount Buttons -->
				<div class="grid grid-cols-4 gap-2">
					{#each [0.1, 0.5, 1.0, 5.0] as quickAmount}
						<button
							type="button"
							onclick={() => amount = Math.min(quickAmount, balance).toFixed(6)}
							disabled={quickAmount > balance}
							class="py-2 px-3 text-xs font-medium text-gray-300 bg-[#1a1a1a] hover:bg-[#252525] disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed border border-[#404040] rounded-lg transition-colors"
						>
							{quickAmount} SOL
						</button>
					{/each}
				</div>

				<!-- Error Display -->
				{#if error}
					<div class="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
						<AlertTriangle size="16" class="text-red-400 mt-0.5 flex-shrink-0" />
						<div class="flex flex-col gap-2">
							<span class="text-red-400 text-sm">{error}</span>
							{#if error.includes('sign in') || error.includes('authenticate')}
								<button 
									onclick={() => goto('/sign-in')}
									class="text-xs text-[#00ccba] hover:text-[#00eeda] underline self-start"
								>
									Go to Sign In
								</button>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Review Button -->
				<button
					onclick={validateAndEstimate}
					disabled={!recipientAddress || !amount || isLoading}
					class="w-full cursor-pointer bg-gradient-to-r from-[#00ccba] to-[#00eeda] hover:from-[#00eeda] hover:to-[#00ccba] disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
				>
					<Send size="16" />
					Review Transaction
				</button>
			</div>
		{:else}
			<!-- Confirmation Screen -->
			<div class="space-y-5">
				<div class="text-center">
					<h2 class="text-lg font-bold text-white mb-2">Confirm Transaction</h2>
					<p class="text-sm text-gray-400">Please review the details before sending</p>
				</div>
				
				<!-- Transaction Summary -->
				<div class="bg-gradient-to-r from-[#1a1a1a] to-[#252525] rounded-xl p-4 border border-[#404040] space-y-3">
					<div class="flex justify-between items-center">
						<span class="text-gray-400 text-sm">To</span>
						<span class="text-xs font-mono text-gray-300">{formatWalletAddress(recipientAddress)}</span>
					</div>
					<div class="flex justify-between items-center">
						<span class="text-gray-400 text-sm">Amount</span>
						<div class="text-right">
							<span class="font-bold text-[#00ccba]">{parseFloat(amount).toFixed(6)}</span>
							<span class="text-gray-400 text-sm ml-1">SOL</span>
						</div>
					</div>
					<div class="flex justify-between items-center">
						<span class="text-gray-400 text-sm">Network Fee</span>
						<div class="text-right">
							<span class="text-sm">~{estimatedFee.toFixed(6)}</span>
							<span class="text-gray-400 text-sm ml-1">SOL</span>
						</div>
					</div>
					<hr class="border-[#404040]" />
					<div class="flex justify-between items-center font-bold">
						<span class="text-white">Total</span>
						<div class="text-right">
							<span class="text-[#00ccba]">{(parseFloat(amount) + estimatedFee).toFixed(6)}</span>
							<span class="text-gray-400 text-sm ml-1">SOL</span>
						</div>
					</div>
				</div>

				<!-- Error Display -->
				{#if error}
					<div class="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
						<AlertTriangle size="16" class="text-red-400 mt-0.5 flex-shrink-0" />
						<span class="text-red-400 text-sm">{error}</span>
					</div>
				{/if}

				<!-- Action Buttons -->
				<div class="flex gap-3">
					<button
						onclick={resetForm}
						disabled={isLoading}
						class="flex-1 bg-[#2a2a2a] hover:bg-[#353535] disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-colors border border-[#404040]"
					>
						Cancel
					</button>
					<button
						onclick={sendTransaction}
						disabled={isLoading}
						class="flex-1 bg-gradient-to-r cursor-pointer from-[#00ccba] to-[#00eeda] hover:from-[#00eeda] hover:to-[#00ccba] disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
					>
						{#if isLoading}
							<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
							Sending...
						{:else}
							<Send size="16" />
							Send SOL
						{/if}
					</button>
				</div>
			</div>
		{/if}
	</div>

	<!-- Password Prompt Modal -->
	{#if showPasswordPrompt}
		<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div class="bg-[#101212] border border-[#303030] rounded-xl p-6 w-full max-w-md">
				<h3 class="text-lg font-bold text-white mb-4">Enter Wallet Password</h3>
				<p class="text-gray-400 text-sm mb-4">Please enter your wallet password to sign this transaction.</p>
				
				<div class="space-y-4">
					<input
						type="password"
						bind:value={password}
						placeholder="Enter your password"
						class="w-full p-3 bg-[#1a1a1a] border border-[#404040] rounded-xl focus:border-[#00ccba] focus:ring-1 focus:ring-[#00ccba] focus:outline-none text-white placeholder-gray-500"
						onkeydown={(e) => e.key === 'Enter' && authenticateAndSend()}
					/>
					
					{#if error}
						<div class="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
							<AlertTriangle size="16" class="text-red-400 mt-0.5 flex-shrink-0" />
							<span class="text-red-400 text-sm">{error}</span>
						</div>
					{/if}
					
					<div class="flex gap-3">
						<button
							onclick={() => {showPasswordPrompt = false; password = ''; error = '';}}
							disabled={isLoading}
							class="flex-1 bg-[#2a2a2a] hover:bg-[#353535] disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-colors border border-[#404040]"
						>
							Cancel
						</button>
						<button
							onclick={authenticateAndSend}
							disabled={isLoading || !password.trim()}
							class="flex-1 bg-gradient-to-r from-[#00ccba] to-[#00eeda] hover:from-[#00eeda] hover:to-[#00ccba] disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
						>
							{#if isLoading}
								<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
								Signing...
							{:else}
								Confirm
							{/if}
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</section>

<!-- Success Dialog -->
{#if showSuccessDialog}
	<Dialog open={showSuccessDialog} onClose={closeSuccessDialog}>
		<div class="p-6 text-center">
			<div class="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
				<CheckCircle class="w-6 h-6 text-green-600" />
			</div>
			
			<h3 class="text-lg font-medium text-white mb-2">Transaction Successful!</h3>
			<p class="text-sm text-gray-400 mb-6">{successMessage}</p>
			
			{#if transactionSignature}
				<div class="bg-[#1a1a1a] rounded-lg p-3 mb-6 border border-[#404040]">
					<p class="text-xs text-gray-500 mb-1">Transaction Signature:</p>
					<p class="text-xs font-mono text-gray-300 break-all">{transactionSignature}</p>
				</div>
			{/if}
			
			<div class="flex flex-col gap-3">
				<button
					onclick={goToWallet}
					class="w-full bg-gradient-to-r from-[#00ccba] to-[#00eeda] hover:from-[#00eeda] hover:to-[#00ccba] text-black font-bold py-3 px-4 rounded-xl transition-all"
				>
					Go to Wallet
				</button>
				
				{#if transactionSignature}
					<button
						onclick={viewTransaction}
						class="w-full bg-[#2a2a2a] hover:bg-[#353535] text-white font-medium py-3 px-4 rounded-xl transition-colors border border-[#404040]"
					>
						View on Explorer
					</button>
				{/if}
				
				<button
					onclick={closeSuccessDialog}
					class="w-full text-gray-400 hover:text-white py-2 transition-colors"
				>
					Stay Here
				</button>
			</div>
		</div>
	</Dialog>
{/if}

<!-- Toast Notifications -->
{#if showToast}
	<Toast
		status={toastMessage}
		success={toastType === 'success'}
		error={toastType === 'error'}
		open={showToast}
	/>
{/if}
