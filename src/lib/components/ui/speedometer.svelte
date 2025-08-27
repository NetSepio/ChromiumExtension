<script lang="ts">
	const { speed = 0, isTestRunning = false, testCompleted = false } = $props();
	
	let animationProgress = $state(0);
	
	// Simple CSS-based speedometer animation instead of Lottie
	$effect(() => {
		if (isTestRunning && !testCompleted) {
			// Animate progress during test
			const interval = setInterval(() => {
				animationProgress = Math.min(animationProgress + 2, 100);
			}, 100);
			return () => clearInterval(interval);
		} else if (testCompleted) {
			// Set final progress when test completes
			animationProgress = 100;
		} else {
			// Reset when not running
			animationProgress = 0;
		}
	});
</script>

<div class="speedometer-container">
	{#if isTestRunning}
		<div class="css-speedometer">
			<div class="speedometer-arc">
				<div class="speedometer-needle" style="transform: rotate({animationProgress * 1.8}deg)"></div>
			</div>
			<div class="speed-overlay speed-overlay-small animate-slide-down">
				<span class="speed-value-small">{Math.round(speed)}</span>
				<span class="speed-unit-small">Mbps</span>
			</div>
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
	
	.css-speedometer {
		position: relative;
		width: 264px;
		height: 182px;
		margin: auto;
		z-index: 1;
		animation: fadeInScale 0.5s ease-out forwards;
	}
	
	.speedometer-arc {
		position: relative;
		width: 200px;
		height: 100px;
		margin: 40px auto;
		border: 4px solid #333;
		border-bottom: none;
		border-radius: 100px 100px 0 0;
		background: linear-gradient(90deg, #ff4444 0%, #ffaa00 50%, #00ccba 100%);
		background-clip: padding-box;
	}
	
	.speedometer-arc::before {
		content: '';
		position: absolute;
		top: 4px;
		left: 4px;
		right: 4px;
		bottom: -4px;
		background: #101212;
		border-radius: 92px 92px 0 0;
	}
	
	.speedometer-needle {
		position: absolute;
		bottom: -2px;
		left: 50%;
		width: 2px;
		height: 80px;
		background: #00ccba;
		transform-origin: bottom center;
		transform: translateX(-50%) rotate(0deg);
		transition: transform 0.3s ease;
		z-index: 2;
	}
	
	.speedometer-needle::after {
		content: '';
		position: absolute;
		bottom: -8px;
		left: -6px;
		width: 14px;
		height: 14px;
		background: #00ccba;
		border-radius: 50%;
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
