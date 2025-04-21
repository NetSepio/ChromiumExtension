<script lang="ts">
	import VpnHeader from '@/components/ui/vpn-header.svelte';

	import backgroundImage from '../../lib/assets/world-map.png';
	// import * as Select from '$lib/components/ui/select/index.js';
	import { Select, Button } from 'bits-ui';
	import VpnButton from '@/components/ui/vpn-button.svelte';

	const locations = [
		{
			id: 1,
			flag: '/flags/us.png',
			country: 'United States',
			location: 'New York',
			ip: '192.168.1.1',
			signal: 'strong'
		},
		{
			id: 2,
			flag: '/flags/de.png',
			country: 'Germany',
			location: 'Berlin',
			ip: '192.168.2.1',
			signal: 'medium'
		},
		{
			id: 3,
			flag: '/flags/jp.png',
			country: 'Japan',
			location: 'Tokyo',
			ip: '192.168.3.1',
			signal: 'weak'
		}
	];
</script>

<section
	class="relative h-full p-6 bg-contain bg-top bg-no-repeat bg-blend-luminosity bg-[#111111] overflow-hidden border border-red-500 w-full"
	style="background-image: url({backgroundImage});"
>
	<VpnHeader />
	<div
		class="py-2 px-4 rounded-lg bg-[#f1f1f13f] bg-opacity-50 backdrop-blur-sm hover:shadow-md transition-all mt-4 flex items-center justify-between"
	>
		<div class="flex items items-center gap-4">
			<svg
				width="42"
				height="30"
				viewBox="0 0 42 30"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g clip-path="url(#clip0_2003_8391)">
					<g clip-path="url(#clip1_2003_8391)">
						<rect width="41.25" height="30" rx="3.75" fill="#1A47B8" />
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M4.38816 0H0V5L36.838 30L41.25 30V25L4.38816 0Z"
							fill="white"
						/>
						<path d="M1.46359 0L41.25 27.0709V30H39.8207L0 2.90112V0H1.46359Z" fill="#F93939" />
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M37.3214 0H41.25V5C41.25 5 15.7335 21.6561 3.92857 30H0V25L37.3214 0Z"
							fill="white"
						/>
						<path d="M41.25 0H39.9177L0 27.0942V30H1.46359L41.25 2.92303V0Z" fill="#F93939" />
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M15.0014 0H26.2829V9.25363H41.25V20.7403H26.2829V30H15.0014V20.7403H0V9.25363H15.0014V0Z"
							fill="white"
						/>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M17.3684 0H23.8816V11.5385H41.25V18.4615H23.8816V30H17.3684V18.4615H0V11.5385H17.3684V0Z"
							fill="#F93939"
						/>
					</g>
				</g>
				<defs>
					<clipPath id="clip0_2003_8391">
						<rect width="41.25" height="30" fill="white" />
					</clipPath>
					<clipPath id="clip1_2003_8391">
						<rect width="41.25" height="30" rx="3.75" fill="white" />
					</clipPath>
				</defs>
			</svg>
			<div class="text-sm text-white font-semibold">
				<p>United Kingdom</p>
				<p>London</p>
			</div>
		</div>
		<svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="0.699219" y="12" width="5.16129" height="12" rx="0.688172" fill="#22AD5C" />
			<rect x="8.26953" y="6" width="5.16129" height="18" rx="0.688172" fill="#22AD5C" />
			<rect x="15.8389" width="5.16129" height="24" rx="0.688172" fill="#22AD5C" />
		</svg>
	</div>

	<div class="mt-8 flex items-center justify-center">
	
	</div>

	<div class="top-1/2 absolute left-1/2 -translate-x-1/2 z-30"> 
		<VpnButton />
	</div>
	<div class="absolute -left-[70%] top-[70%] rounded-full size-[850px] bg-[#0eafa2]" ></div>
</section>
