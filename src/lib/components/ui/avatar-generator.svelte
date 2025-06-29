<script lang="ts">
	interface Props {
		address: string;
		size?: number;
		editable?: boolean;
		onAvatarChange?: (newStyle: string) => void;
	}
	
	let { address, size = 80, editable = false, onAvatarChange }: Props = $props();
	
	// Generate deterministic avatar based on wallet address
	function generateAvatar(addr: string) {
		// Create a simple hash from address
		let hash = 0;
		for (let i = 0; i < addr.length; i++) {
			const char = addr.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash; // Convert to 32-bit integer
		}
		
		// Generate colors based on hash
		const hue1 = Math.abs(hash) % 360;
		const hue2 = (hue1 + 180) % 360;
		const saturation = 60 + (Math.abs(hash >> 8) % 30); // 60-90%
		const lightness = 45 + (Math.abs(hash >> 16) % 20); // 45-65%
		
		return {
			background: `linear-gradient(135deg, hsl(${hue1}, ${saturation}%, ${lightness}%), hsl(${hue2}, ${saturation}%, ${lightness - 10}%))`,
			initials: getInitials(addr),
			pattern: generatePattern(hash)
		};
	}
	
	function getInitials(addr: string) {
		// Use first and last character of address for initials
		return (addr.charAt(0) + addr.charAt(addr.length - 1)).toUpperCase();
	}
	
	function generatePattern(hash: number) {
		// Generate a simple geometric pattern
		const patterns = ['dots', 'stripes', 'waves', 'hexagon'];
		return patterns[Math.abs(hash) % patterns.length];
	}
	
	// Avatar styles for customization
	const avatarStyles = [
		{ name: 'Gradient', id: 'gradient' },
		{ name: 'Solid', id: 'solid' },
		{ name: 'Pattern', id: 'pattern' },
		{ name: 'Geometric', id: 'geometric' }
	];
	
	let selectedStyle = $state('gradient');
	let showStylePicker = $state(false);
	
	let avatar = $derived(generateAvatar(address));
	
	function handleStyleChange(styleId: string) {
		selectedStyle = styleId;
		showStylePicker = false;
		if (onAvatarChange) {
			onAvatarChange(styleId);
		}
	}
	
	function getStyleAvatar(styleId: string) {
		const base = generateAvatar(address);
		switch (styleId) {
			case 'solid':
				return {
					...base,
					background: `hsl(${Math.abs(address.length * 17) % 360}, 70%, 50%)`
				};
			case 'pattern':
				return {
					...base,
					background: `repeating-linear-gradient(45deg, hsl(${Math.abs(address.length * 13) % 360}, 60%, 40%), hsl(${Math.abs(address.length * 13) % 360}, 60%, 40%) 10px, hsl(${(Math.abs(address.length * 13) + 60) % 360}, 60%, 50%) 10px, hsl(${(Math.abs(address.length * 13) + 60) % 360}, 60%, 50%) 20px)`
				};
			case 'geometric':
				return {
					...base,
					background: `radial-gradient(circle at 30% 30%, hsl(${Math.abs(address.length * 19) % 360}, 70%, 60%), hsl(${(Math.abs(address.length * 19) + 120) % 360}, 70%, 40%))`
				};
			default:
				return base;
		}
	}
	
	let currentAvatar = $derived(getStyleAvatar(selectedStyle));
</script>

<div class="relative">
	<div 
		class="rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer transition-transform hover:scale-105"
		style="width: {size}px; height: {size}px; background: {currentAvatar.background}; font-size: {size * 0.3}px;"
		onclick={() => editable && (showStylePicker = !showStylePicker)}
		role={editable ? 'button' : 'img'}
		tabindex={editable ? 0 : -1}
		aria-label="User avatar"
	>
		{currentAvatar.initials}
		
		{#if editable}
			<div class="absolute -bottom-1 -right-1 bg-[#00ccba] rounded-full p-1 border-2 border-[#111111] shadow-md">
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
					<path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
				</svg>
			</div>
		{/if}
	</div>
	
	{#if editable && showStylePicker}
		<div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-[#1a1a1a] border border-[#00ccba]/30 rounded-lg p-3 shadow-xl z-50 min-w-[200px]">
			<p class="text-white text-sm font-medium mb-2">Choose Avatar Style</p>
			<div class="grid grid-cols-2 gap-2">
				{#each avatarStyles as style}
					<button
						class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-[#00ccba]/10 transition-colors {selectedStyle === style.id ? 'bg-[#00ccba]/20 border border-[#00ccba]/50' : ''}"
						onclick={() => handleStyleChange(style.id)}
					>
						<div 
							class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
							style="background: {getStyleAvatar(style.id).background}"
						>
							{getStyleAvatar(style.id).initials}
						</div>
						<span class="text-xs text-white/80">{style.name}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<!-- Click outside to close style picker -->
{#if showStylePicker}
	<div 
		class="fixed inset-0 z-40" 
		onclick={() => showStylePicker = false}
		role="button"
		tabindex="-1"
		aria-label="Close style picker"
	></div>
{/if}
