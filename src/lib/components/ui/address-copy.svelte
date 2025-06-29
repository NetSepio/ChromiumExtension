<script lang="ts">
	import { Copy, Check } from '@lucide/svelte';
	
	interface Props {
		address: string;
		showFull?: boolean;
		copyable?: boolean;
	}
	
	let { address, showFull = false, copyable = true }: Props = $props();
	
	let copied = $state(false);
	let copyTimeout: ReturnType<typeof setTimeout>;
	
	function formatAddress(addr: string, full: boolean = false) {
		if (full || addr.length <= 20) {
			return addr;
		}
		return `${addr.substring(0, 8)}...${addr.substring(addr.length - 8)}`;
	}
	
	async function copyToClipboard() {
		if (!copyable) return;
		
		try {
			await navigator.clipboard.writeText(address);
			copied = true;
			
			// Clear any existing timeout
			if (copyTimeout) {
				clearTimeout(copyTimeout);
			}
			
			// Reset after 2 seconds
			copyTimeout = setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (error) {
			console.error('Failed to copy address:', error);
			
			// Fallback for older browsers
			try {
				const textArea = document.createElement('textarea');
				textArea.value = address;
				textArea.style.position = 'fixed';
				textArea.style.opacity = '0';
				document.body.appendChild(textArea);
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
				
				copied = true;
				copyTimeout = setTimeout(() => {
					copied = false;
				}, 2000);
			} catch (fallbackError) {
				console.error('Fallback copy failed:', fallbackError);
			}
		}
	}
	
	// Cleanup timeout on component destroy
	$effect(() => {
		return () => {
			if (copyTimeout) {
				clearTimeout(copyTimeout);
			}
		};
	});
</script>

<div class="flex items-center gap-2 p-3 bg-[#1a1a1a] rounded-lg border border-[#00ccba]/20">
	<div class="flex-1 min-w-0">
		<div class="text-xs text-white/60 mb-1">Wallet Address</div>
		<div class="font-mono text-sm text-white break-all select-all">
			{formatAddress(address, showFull)}
		</div>
	</div>
	
	{#if copyable}
		<button
			class="flex items-center justify-center p-2 rounded-lg bg-[#00ccba]/10 hover:bg-[#00ccba]/20 transition-colors border border-[#00ccba]/30 group"
			onclick={copyToClipboard}
			aria-label="Copy wallet address"
			disabled={copied}
		>
			{#if copied}
				<Check size="16" class="text-green-400" />
			{:else}
				<Copy size="16" class="text-[#00ccba] group-hover:text-white transition-colors" />
			{/if}
		</button>
	{/if}
</div>

{#if copied}
	<div class="text-xs text-green-400 mt-1 animate-pulse">
		✓ Address copied to clipboard
	</div>
{/if}
