<script>
	import logo from '$lib/assets/logo.png';
</script>

<div>
	<header class="flex items-center justify-between">
		<span
			class="size-8 cursor-pointer rounded-full p-1 flex justify-center items-center bg-[#0eafa2]"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-menu-icon lucide-menu"
				><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line
					x1="4"
					x2="20"
					y1="18"
					y2="18"
				/></svg
			>
		</span>
		<img src={logo} alt="Logo" class="logo" />
		<span
			class="size-8 cursor-pointer rounded-full p-1 flex justify-center items-center bg-[#0eafa2]"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-wallet-cards-icon lucide-wallet-cards"
				><rect width="18" height="18" x="3" y="3" rx="2" /><path
					d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"
				/><path
					d="M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21"
				/></svg
			>
		</span>
	</header>
</div>
