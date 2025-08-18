<script lang="ts">
	import { ArrowLeft, Send, AlertTriangle, CheckCircle } from '@lucide/svelte';
	import { privateKeySolana, getChainAddress, walletAddress } from '../../store/store';
	import { SolanaWalletService } from '$lib/helpers/solanaTransactions';
	import { formatWalletAddress } from '$lib/helpers/formatWalletAddress';
	import Toast from '$lib/components/ui/toast.svelte';
	import Dialog from '$lib/components/ui/dialog.svelte';
	import { Keypair } from '@solana/web3.js';
	import { get } from 'svelte/store';

	let address = $state('');
	let recipientAddress = $state('');
	let amount = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let showConfirmation = $state(false);
	let estimatedFee = $state(0);
	let balance = $state(0);
	let solPrice = $state(0);
	let rpcUrl = $state<'mainnet' | 'testnet'>('mainnet');
	let showSuccessDialog = $state(false);
	let successMessage = $state('');
	let transactionSignature = $state('');
	let showToast = $state(false);
	let toastMessage = $state('');
	let toastSuccess = $state(false);
	let toastError = $state(false);

	$effect(() => {
		const savedNetwork = localStorage.getItem('selected-network') as 'mainnet' | 'testnet';
		if (savedNetwork && (savedNetwork === 'mainnet' || savedNetwork === 'testnet')) {
			rpcUrl = savedNetwork;
		}

		async function loadSolanaAddress() {
			try {
				// Try multiple ways to get the address
				const solanaAddr = await getChainAddress('solana');
				const legacyAddr = get(walletAddress);
				
				console.log('Debug address loading:');
				console.log('- Solana chain address:', solanaAddr);
				console.log('- Legacy wallet address:', legacyAddr);
				
				// Use any available address
				address = solanaAddr || legacyAddr;
				
				if (!address) {
					// Force reload from Chrome storage as last resort
					const result = await chrome.storage.local.get(['walletAddress', 'solanaAddress']);
					address = result.solanaAddress || result.walletAddress;
					console.log('- Chrome storage fallback:', address);
				}
				
				if (address) {
					console.log('✅ Using Solana address:', address);
					loadBalance();
				} else {
					console.error('❌ No wallet address found anywhere');
					error = 'Wallet address not found. Please go back to wallet and ensure it loads properly.';
				}
			} catch (err) {
				console.error('Error loading Solana address:', err);
				error = 'Failed to load wallet address.';
			}
		}

		loadSolanaAddress();
	});

	let walletService = $derived(new SolanaWalletService(rpcUrl));

	async function fetchSOLPrice(): Promise<number> {
		try {
			const response = await fetch(
				'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
			);
			const data = await response.json();
			return data.solana.usd;
		} catch (error) {
			console.error('Price fetch error:', error);
			return 0;
		}
	}

	function showToastMessage(message: string, type: 'success' | 'error' | 'info' = 'info') {
		toastMessage = message;
		toastSuccess = type === 'success';
		toastError = type === 'error';
		showToast = true;
	}

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
			console.log(`Loading balance for address: ${address} on ${rpcUrl} network`);
			balance = await walletService.getBalance(address);
			console.log(`Loaded balance: ${balance} SOL`);

			if (solPrice === 0) {
				try {
					solPrice = await fetchSOLPrice();
					console.log('SOL Price:', solPrice);
				} catch (error) {
					console.error('Failed to fetch SOL price:', error);
				}
			}
		} catch (err) {
			console.error('Failed to load balance:', err);
			error = 'Failed to load balance. Please refresh and try again.';
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

		try {
			// Use the correct Solana private key with better fallback
			let storedPrivateKey = get(privateKeySolana);
			
			if (!storedPrivateKey) {
				// Try to load from Chrome storage directly
				const result = await chrome.storage.local.get(['privateKeySolana', 'privateKey']);
				storedPrivateKey = result.privateKeySolana || result.privateKey;
				
				if (storedPrivateKey) {
					// Update the store with the found key
					privateKeySolana.set(storedPrivateKey);
					console.log('✅ Loaded Solana private key from storage');
				}
			}
			
			if (!storedPrivateKey) {
				error = 'Solana private key not found. Please go back to wallet page to reload your keys.';
				isLoading = false;
				return;
			}

			console.log('Creating keypair for transaction');
			console.log('Expected address:', address);
			
			let privateKeyBytes = Uint8Array.from(Buffer.from(storedPrivateKey, 'hex'));
			let keypair = Keypair.fromSeed(privateKeyBytes);
			let derivedAddress = keypair.publicKey.toBase58();
			
			console.log('Derived address:', derivedAddress);
			
			if (derivedAddress !== address) {
				console.error('Keypair public key mismatch!');
				console.error(`Expected: ${address}, Got: ${derivedAddress}`);
				error = 'Authentication error: Key mismatch. Please refresh the page.';
				isLoading = false;
				return;
			}

			await executeTransaction(keypair);
		} catch (err) {
			console.error('Send transaction error:', err);
			error = err instanceof Error ? err.message : 'Transaction failed';
		} finally {
			isLoading = false;
		}
	}

	async function executeTransaction(keypair: Keypair) {
		try {
			showToastMessage('Sending transaction...', 'info');

			console.log(`Attempting to send ${amount} SOL from ${address} to ${recipientAddress}`);
			console.log(`Current balance: ${balance} SOL, Estimated fee: ${estimatedFee} SOL`);

			const result = await walletService.sendSOL(
				keypair,
				recipientAddress.trim(),
				parseFloat(amount)
			);

			if (result.success) {
				successMessage = `Transaction sent successfully!`;
				transactionSignature = result.signature || '';
				showSuccessDialog = true;
				showToastMessage('Transaction confirmed on blockchain!', 'success');

				recipientAddress = '';
				amount = '';
				showConfirmation = false;
				await loadBalance();
			} else {
				console.error('Transaction failed with error:', result.error);
				error = result.error || 'Transaction failed';
				showToastMessage('Transaction failed', 'error');
			}
		} catch (err) {
			console.error('Transaction execution error:', err);
			error = err instanceof Error ? err.message : 'Transaction execution failed';
			showToastMessage('Transaction failed', 'error');
		}
	}

	function goBack() {
		window.history.back();
	}

	function resetForm() {
		showConfirmation = false;
		error = '';
		estimatedFee = 0;
	}

	function setMaxAmount() {
		if (estimatedFee > 0) {
			const maxSendable = Math.max(balance - estimatedFee, 0);
			amount = maxSendable.toFixed(6);
		} else {
			const maxSendable = Math.max(balance - 0.0005, 0);
			amount = maxSendable.toFixed(6);
		}
	}

	function closeSuccessDialog() {
		showSuccessDialog = false;
		successMessage = '';
		transactionSignature = '';
	}
</script>

<div class="relative flex h-[600px] max-h-[600px] flex-col overflow-hidden bg-[#101212] text-white">
	<div class="border-b border-[#333333] bg-[#070707] backdrop-blur-sm">
		<div class="mx-auto max-w-md px-4 py-4">
			<div class="flex items-center justify-between">
				<button
					onclick={goBack}
					class="flex items-center gap-2 rounded-xl px-3 py-2 text-white transition-colors hover:bg-[#2a2a2a]"
				>
					<ArrowLeft size="20" />
					<span class="font-medium">Send SOL</span>
				</button>
			</div>
		</div>
	</div>

	<div class="mx-auto flex w-full max-w-md flex-1 flex-col overflow-y-auto px-4 py-6">
		<div class="mb-6 rounded-2xl border border-[#333333] bg-[#1a1a1a] p-4">
			<div class="mb-3 flex items-center justify-between">
				<span class="text-sm text-gray-400">From</span>
				<span class="font-mono text-xs text-gray-300">{formatWalletAddress(address)}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-400">Balance</span>
				<div class="text-right">
					<div>
						<span class="font-bold text-[#00ccba]">{balance.toFixed(6)}</span>
						<span class="ml-1 text-sm text-gray-400">SOL</span>
					</div>
					{#if solPrice > 0}
						<div class="text-xs text-gray-500">
							${(balance * solPrice).toFixed(2)}
						</div>
					{/if}
				</div>
			</div>
		</div>

		{#if !showConfirmation}
			<div class="space-y-5">
				<div class="space-y-2">
					<label for="recipient" class="block text-sm font-medium text-gray-300">Recipient Address</label>
					<input
						id="recipient"
						type="text"
						bind:value={recipientAddress}
						placeholder="Enter Solana address"
						class="w-full rounded-xl border border-[#333333] bg-[#1a1a1a] p-3 text-sm text-white placeholder-gray-500 transition-all focus:border-[#00ccba] focus:ring-1 focus:ring-[#00ccba] focus:outline-none"
					/>
				</div>

				<div class="space-y-2">
					<label for="amount" class="block text-sm font-medium text-gray-300">Amount</label>
					<div class="relative">
						<input
							id="amount"
							type="number"
							step="0.000001"
							min="0"
							max={balance}
							bind:value={amount}
							placeholder="0.000000"
							class="w-full rounded-xl border border-[#333333] bg-[#1a1a1a] p-3 text-sm text-white placeholder-gray-500 transition-all focus:border-[#00ccba] focus:ring-1 focus:ring-[#00ccba] focus:outline-none"
						/>
						<div class="mt-2 flex items-center justify-between">
							<div class="text-left">
								<span class="text-xs text-gray-500">SOL</span>
								{#if solPrice > 0 && amount && parseFloat(amount) > 0}
									<div class="text-xs text-gray-500">
										≈ ${(parseFloat(amount) * solPrice).toFixed(2)}
									</div>
								{/if}
							</div>
							<button
								type="button"
								onclick={setMaxAmount}
								class="rounded-md px-2 py-1 text-xs font-medium text-[#00ccba] transition-colors hover:bg-[#00ccba]/10"
							>
								MAX
							</button>
						</div>
					</div>
				</div>

				{#if error}
					<div class="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
						<AlertTriangle size="16" class="mt-0.5 flex-shrink-0 text-red-400" />
						<span class="text-sm text-red-400">{error}</span>
					</div>
				{/if}

				<div class="mt-8 space-y-3">
					<button
						onclick={validateAndEstimate}
						disabled={isLoading || !recipientAddress.trim() || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
						class="w-full rounded-3xl bg-gradient-to-r from-[#00ccba] to-[#00eeda] px-4 py-4 font-bold text-black transition-all hover:from-[#00eeda] hover:to-[#00ccba] disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-600"
					>
						{isLoading ? 'Processing...' : 'Review Transaction'}
					</button>
				</div>
			</div>
		{:else}
			<div class="space-y-6">
				<div class="text-center">
					<h2 class="text-xl font-bold text-white">Review Transaction</h2>
					<p class="mt-1 text-sm text-gray-400">Please confirm the transaction details</p>
				</div>

				<div class="space-y-4 rounded-2xl border border-[#333333] bg-[#1a1a1a] p-4">
					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-400">To</span>
						<span class="font-mono text-xs text-gray-300">{formatWalletAddress(recipientAddress)}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-400">Amount</span>
						<div class="text-right">
							<div>
								<span class="font-bold text-[#00ccba]">{parseFloat(amount).toFixed(6)}</span>
								<span class="ml-1 text-sm text-gray-400">SOL</span>
							</div>
							{#if solPrice > 0}
								<div class="text-xs text-gray-500">
									${(parseFloat(amount) * solPrice).toFixed(2)}
								</div>
							{/if}
						</div>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-400">Network Fee</span>
						<div class="text-right">
							<div>
								<span class="text-sm">~{estimatedFee.toFixed(6)}</span>
								<span class="ml-1 text-sm text-gray-400">SOL</span>
							</div>
							{#if solPrice > 0}
								<div class="text-xs text-gray-500">
									≈ ${(estimatedFee * solPrice).toFixed(2)}
								</div>
							{/if}
						</div>
					</div>
					<hr class="border-[#333333]" />
					<div class="flex items-center justify-between font-bold">
						<span class="text-white">Total</span>
						<div class="text-right">
							<div>
								<span class="text-[#00ccba]">{(parseFloat(amount) + estimatedFee).toFixed(6)}</span>
								<span class="ml-1 text-sm text-gray-400">SOL</span>
							</div>
							{#if solPrice > 0}
								<div class="text-xs text-gray-500">
									≈ ${((parseFloat(amount) + estimatedFee) * solPrice).toFixed(2)}
								</div>
							{/if}
						</div>
					</div>
				</div>

				{#if error}
					<div class="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
						<AlertTriangle size="16" class="mt-0.5 flex-shrink-0 text-red-400" />
						<span class="text-sm text-red-400">{error}</span>
					</div>
				{/if}

				<div class="flex gap-3">
					<button
						onclick={resetForm}
						disabled={isLoading}
						class="flex-1 rounded-3xl border border-[#404040] bg-[#2a2a2a] px-4 py-3 font-bold text-white transition-colors hover:bg-[#353535] disabled:cursor-not-allowed disabled:bg-gray-700"
					>
						Cancel
					</button>
					<button
						onclick={sendTransaction}
						disabled={isLoading}
						class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-[#00ccba] to-[#00eeda] px-4 py-3 font-bold text-black shadow-lg transition-all hover:from-[#00eeda] hover:to-[#00ccba] disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-600"
					>
						{#if isLoading}
							<div class="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
							<span>Sending...</span>
						{:else}
							<Send size="16" />
							<span>Send SOL</span>
						{/if}
					</button>
				</div>
			</div>
		{/if}
	</div>

	{#if showSuccessDialog}
		<Dialog open={showSuccessDialog} onClose={closeSuccessDialog}>
			{#snippet children()}
				<div class="space-y-6 text-center rounded-xl border border-[#404040] bg-[#1a1a1a] p-6">
					<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
						<CheckCircle size="32" class="text-green-400" />
					</div>
					<div>
						<h3 class="text-xl font-bold text-white">Transaction Successful!</h3>
						<p class="mt-2 text-sm text-gray-400">{successMessage}</p>
					</div>
					{#if transactionSignature}
						<div class="rounded-xl border border-[#404040] bg-[#2a2a2a] p-4">
							<p class="mb-2 text-sm font-medium text-gray-300">Transaction ID</p>
							<p class="break-all font-mono text-xs text-gray-400">{transactionSignature}</p>
						</div>
					{/if}
					<button
						onclick={closeSuccessDialog}
						class="w-full rounded-xl border border-[#404040] bg-[#2a2a2a] px-4 py-3 font-medium text-white transition-colors hover:bg-[#353535]"
					>
						Close
					</button>
				</div>
			{/snippet}
		</Dialog>
	{/if}

	<Toast 
		open={showToast} 
		status={toastMessage} 
		success={toastSuccess} 
		error={toastError} 
	/>
</div>