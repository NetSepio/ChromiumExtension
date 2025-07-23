<script lang="ts">
	// Svelte 5 runes: all state and DOM refs use $state
	const { speed = 0, isTestRunning = false } = $props();
	let lottieContainer: HTMLElement | null = $state(null); // DOM ref for bind:this
	let lottieInstance: any = $state(null); // Lottie animation instance
	const showLottie = $derived(() => isTestRunning); // Show animation only during tests

	function loadLottie() {
		console.log('Loading Lottie animation...');
		if (lottieInstance) {
			lottieInstance.destroy();
			lottieInstance = null;
		}
		if (!lottieContainer) {
			console.log('No lottie container found');
			return;
		}
		const lottie = (window as any).lottie;
		if (!lottie) {
			console.log('Lottie library not found');
			return;
		}
		console.log('Creating Lottie animation instance...');
		const newInstance = lottie.loadAnimation({
			container: lottieContainer,
			renderer: 'svg',
			loop: true,
			autoplay: true,
			path: './assets/animations/Speed Test.json',
			rendererSettings: { preserveAspectRatio: 'xMidYMid meet' }
		});
		newInstance.addEventListener('DOMLoaded', () => {
			console.log('Lottie animation loaded successfully');
		});
		newInstance.addEventListener('error', (error: any) => {
			console.error('Lottie animation error:', error);
		});
		lottieInstance = newInstance;
	}

	function ensureLottieWeb() {
		const lottie = (window as any).lottie;
		if (!lottie) {
			const script = document.createElement('script');
			script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
			script.onload = () => loadLottie();
			document.head.appendChild(script);
		} else {
			loadLottie();
		}
	}

	$effect(() => {
		if (isTestRunning && lottieContainer) {
			// Ensure Lottie is loaded when test starts
			const timer = setTimeout(() => {
				ensureLottieWeb();
			}, 100);
			return () => clearTimeout(timer);
		} else if (!isTestRunning && lottieInstance) {
			// Clean up when test ends
			lottieInstance.destroy();
			lottieInstance = null;
		}
	});
</script>

<div class="speedometer-container">
	{#if showLottie()}
		<div
			bind:this={lottieContainer}
			class="lottie-animation"
			style="width:264px;height:182px;margin:auto;"
		></div>
		<div class="speed-overlay speed-overlay-small animate-slide-down">
			<span class="speed-value-small">{Math.round(speed)}</span>
			<span class="speed-unit-small">Mbps</span>
		</div>
	{:else}
		<div class="speed-display-large animate-slide-up">
			<span class="speed-value-large">{Math.round(speed)}</span>
			<span class="speed-unit-large">Mbps</span>
		</div>
	{/if}
</div>

<style>
	.speedometer-container {
		position: relative;
		width: 264px;
		height: 182px;
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.lottie-animation {
		width: 264px;
		height: 182px;
		margin: auto;
		z-index: 1;
	}
	.speed-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 2;
		pointer-events: none;
	}
	.speed-overlay-small {
		position: absolute;
		bottom: -30px;
		left: 0;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 2;
		pointer-events: none;
	}
	.speed-value {
		color: #00ccba;
		font-size: 2.5rem;
		font-weight: bold;
		line-height: 1;
	}
	.speed-unit {
		color: #00ccba;
		font-size: 1rem;
		margin-top: 0.2rem;
	}
	.speed-value-small {
		color: #00ccba;
		font-size: 1.5rem;
		font-weight: bold;
		line-height: 1;
	}
	.speed-unit-small {
		color: #00ccba;
		font-size: 0.875rem;
		margin-top: 0.1rem;
	}
	.speed-display-large {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
	.speed-value-large {
		color: #00ccba;
		font-size: 4rem;
		font-weight: bold;
		line-height: 1;
	}
	.speed-unit-large {
		color: #00ccba;
		font-size: 1.5rem;
		margin-top: 0.5rem;
	}

	/* Animation classes */
	.animate-slide-down {
		animation: slideDown 0.5s ease-out forwards;
	}

	.animate-slide-up {
		animation: slideUp 0.5s ease-out forwards;
	}

	@keyframes slideDown {
		0% {
			transform: translateY(0);
			font-size: 4rem;
		}
		100% {
			transform: translateY(30px);
			font-size: 1.5rem;
		}
	}

	@keyframes slideUp {
		0% {
			transform: translateY(30px);
			font-size: 1.5rem;
		}
		100% {
			transform: translateY(0);
			font-size: 4rem;
		}
	}

	/* Lottie animation entrance */
	.lottie-animation {
		animation: fadeInScale 0.5s ease-out forwards;
	}

	@keyframes fadeInScale {
		0% {
			opacity: 0;
			transform: scale(0.8);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
