<script>
	let { speed = 0, maxSpeed = 100 } = $props();
	
	// Calculate needle rotation based on speed
	// Speed gauge goes from -140 degrees (0 speed) to +140 degrees (max speed)
	const needleRotation = $derived(((speed / maxSpeed) * 280) - 140);
	
	// Calculate the dynamic arc path based on speed percentage
	const speedPercentage = $derived(Math.min(speed / maxSpeed, 1));
	
	// Generate dynamic arc path that grows with speed
	const dynamicArcPath = $derived(() => {
		if (speedPercentage <= 0) return "";
		
		const radius = 126; // Same as the background arc
		const centerX = 165;
		const centerY = 165;
		
		// Start angle: -140 degrees (same as background)
		const startAngle = -140;
		// End angle: grows from -140 to +140 based on speed
		const endAngle = startAngle + (280 * speedPercentage);
		
		// Convert to radians
		const startRad = (startAngle * Math.PI) / 180;
		const endRad = (endAngle * Math.PI) / 180;
		
		// Calculate start and end points
		const startX = centerX + radius * Math.cos(startRad);
		const startY = centerY + radius * Math.sin(startRad);
		const endX = centerX + radius * Math.cos(endRad);
		const endY = centerY + radius * Math.sin(endRad);
		
		// Determine if we need a large arc flag
		const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
		
		// Create SVG path
		return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
	});
	
	// Center point for needle rotation
	const centerX = 165;
	const centerY = 165;
</script>

<div class="speedometer-container">
	<svg width="330" height="301" viewBox="0 0 330 301" fill="none" xmlns="http://www.w3.org/2000/svg" class='size-56 mx-auto'>
		<!-- Speedometer background -->
		<path d="M49.5119 223.177C46.5058 224.571 42.9248 223.269 41.6706 220.202C34.1699 201.858 30.9523 182.016 32.2988 162.191C33.7811 140.367 40.746 119.271 52.5486 100.854C64.3513 82.4383 80.61 67.2979 99.8192 56.8355C119.028 46.373 140.567 40.9266 162.441 41.0007C184.314 41.0749 205.815 46.6671 224.953 57.2595C244.091 67.8519 260.247 83.1021 271.924 101.598C283.602 120.094 290.424 141.237 291.758 163.07C292.97 182.904 289.618 202.724 281.993 221.016C280.718 224.075 277.129 225.353 274.132 223.938L255.594 215.186C252.597 213.771 251.334 210.201 252.561 207.123C257.879 193.792 260.197 179.427 259.318 165.052C258.318 148.678 253.201 132.82 244.443 118.948C235.685 105.077 223.568 93.6389 209.215 85.6946C194.861 77.7503 178.736 73.5561 162.33 73.5006C145.925 73.445 129.771 77.5297 115.364 85.3766C100.957 93.2235 88.7634 104.579 79.9115 118.391C71.0595 132.203 65.8358 148.025 64.7241 164.393C63.7482 178.761 65.9689 193.142 71.1959 206.509C72.4028 209.595 71.1148 213.156 68.1087 214.551L49.5119 223.177Z" fill="#E7E2DA"/>
		
		<!-- Active speed arc (dynamic based on speed) -->
		{#if speedPercentage > 0}
			<path 
				d={dynamicArcPath()} 
				fill="none" 
				stroke="#00ccba" 
				stroke-width="28" 
				stroke-linecap="round"
			/>
		{/if}
		
		<!-- Needle -->
		<g transform={`rotate(${needleRotation} ${centerX} ${centerY})`}>
			<line 
				x1={centerX} 
				y1={centerY} 
				x2={centerX} 
				y2="70" 
				stroke="#00ccba" 
				stroke-width="3" 
				stroke-linecap="round"
			/>
			<!-- Needle center dot -->
			<circle 
				cx={centerX} 
				cy={centerY} 
				r="6" 
				fill="#00ccba"
			/>
		</g>
		
		<!-- Speed display -->
		<text x="165" y="185" text-anchor="middle" fill="#00ccba" font-size="24" font-weight="bold">
			{Math.round(speed)}
		</text>
		<text x="165" y="205" text-anchor="middle" fill="#00ccba" font-size="12">
			Mbps
		</text>
		
		<!-- Speed scale markers -->
		<text x="13" y="235" text-anchor="middle" fill="#6D6C69" font-size="12">0</text>
		<text x="35" y="85" text-anchor="middle" fill="#6D6C69" font-size="12">10</text>
		<text x="85" y="35" text-anchor="middle" fill="#6D6C69" font-size="12">20</text>
		<text x="165" y="25" text-anchor="middle" fill="#6D6C69" font-size="12">30</text>
		<text x="245" y="35" text-anchor="middle" fill="#6D6C69" font-size="12">50</text>
		<text x="295" y="85" text-anchor="middle" fill="#6D6C69" font-size="12">75</text>
		<text x="317" y="235" text-anchor="middle" fill="#6D6C69" font-size="12">100</text>
	</svg>
</div>

<style>
	.speedometer-container {
		position: relative;
	}
	
	svg line, svg circle {
		transition: transform 0.5s ease-out;
	}
</style>
  