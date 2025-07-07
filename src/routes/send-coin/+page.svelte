<script lang='ts'>
	import { ArrowLeft, Send, AlertTriangle, Plus, Minus } from "@lucide/svelte";
	import { walletAddress } from '../../store/store';
	import { SolanaWalletService } from '$lib/helpers/solanaTransactions';
	import { formatWalletAddress } from "$lib/helpers/formatWalletAddress";
	import Toast from "$lib/components/ui/toast.svelte";
	import { SecurePasswordManager } from "$lib/helpers/securePasswordManager";

	let address = $state('');
	let recipientAddress = $state('');
	let amount = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let success = $state('');
	let showConfirmation = $state(false);
	let estimatedFee = $state(0);
	let balance = $state(0);
	let rpcUrl = $state<'mainnet' | 'testnet'>('mainnet');

	// Load saved network preference on component mount
	$effect(() => {
		const savedNetwork = localStorage.getItem('selected-network') as 'mainnet' | 'testnet';
		if (savedNetwork && (savedNetwork === 'mainnet' || savedNetwork === 'testnet')) {
			rpcUrl = savedNetwork;
		}
	});

	walletAddress.subscribe((value) => address = value);

	let walletService = $derived(new SolanaWalletService(rpcUrl));

	// Load balance on mount
	$effect(() => {
		if (address) {
			loadBalance();
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
		
		try {
			// Get the wallet keypair from secure storage
			const authResult = await SecurePasswordManager.getAuthStatus();
			if (!authResult.isUnlocked) {
				error = 'Wallet is locked. Please unlock first.';
				return;
			}

			// Get mnemonic from secure storage (we need to create this method)
			// For now, we'll show a message that the feature is coming soon
			error = 'Transaction sending is coming soon. Secure key management is being implemented.';
			return;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Transaction failed';
			console.error('Send transaction error:', err);
		} finally {
			isLoading = false;
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

	<div class="h-[calc(100%-4rem)] overflow-y-auto space-y-5">
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
						<span class="text-red-400 text-sm">{error}</span>
					</div>
				{/if}

				<!-- Review Button -->
				<button
					onclick={validateAndEstimate}
					disabled={!recipientAddress || !amount || isLoading}
					class="w-full bg-gradient-to-r from-[#00ccba] to-[#00eeda] hover:from-[#00eeda] hover:to-[#00ccba] disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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
						class="flex-1 bg-gradient-to-r from-[#00ccba] to-[#00eeda] hover:from-[#00eeda] hover:to-[#00ccba] disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
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
</section>

{#if success}
	<Toast
		status={success}
		success={true}
		error={false}
		open={true}
	/>
{/if}