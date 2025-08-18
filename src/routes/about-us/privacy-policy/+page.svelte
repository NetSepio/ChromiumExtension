<script>
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import { goto } from '$app/navigation';
</script>

<section class="h-full overflow-y-auto bg-[#111111] text-white privacy-policy-scroll">
	<VpnHeader />
	
	<div class="pt-4 p-4 space-y-6 max-w-4xl mx-auto">
		<!-- Header -->
		<div class="text-center space-y-2 mb-8">
			<h1 class="text-xl font-bold text-[#00ccba]">Privacy Policy</h1>
			<p class="text-sm text-gray-400">Your privacy rights and data protection</p>
		</div>

		<!-- Content -->
		<div class="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4 space-y-6">
			<!-- Introduction -->
			<div class="space-y-4">
				<h2 class="text-base font-semibold text-white text-center">Privacy Policy Overview</h2>
				<p class="text-gray-300 leading-relaxed text-sm">
					This Privacy Policy describes our policies and procedures on the collection, use and disclosure of your information when you use the Service and tells you about your privacy rights and how the law protects You. We use your Personal data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy.
				</p>
			</div>

			<!-- Personal Information -->
			<div class="space-y-4">
				<h3 class="text-base text-center font-semibold text-[#00ccba]">Personal Information We Collect</h3>
				<p class="text-gray-300 leading-relaxed text-sm">
					While using Our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to:
				</p>
				<ul class="list-disc list-inside text-gray-300 space-y-2 ml-2 text-sm">
					<li>Email address</li>
					<li>First name and last name</li>
					<li>Twitter and Discord account</li>
					<li>Usage Data</li>
				</ul>
			</div>

			<!-- Usage Data -->
			<div class="space-y-4">
				<h3 class="text-base font-semibold text-[#00ccba] text-center">Usage Data</h3>
				<p class="text-gray-300 leading-relaxed text-sm">
					Usage Data is collected automatically when using the Service. Usage Data may include information such as your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
				</p>
			</div>

			<!-- Cookies and Tracking -->
			<div class="space-y-4">
				<h3 class="text-base text-center font-semibold text-[#00ccba]">Cookies and Tracking Technologies</h3>
				<p class="text-gray-300 leading-relaxed text-sm">
					We use Cookies and similar tracking technologies to track the activity on our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.
				</p>
				
				<div class="bg-[#0a0a0a] border border-[#333333] rounded-lg p-4 space-y-3">
					<h4 class="text-md font-medium text-white text-center">Types of Cookies We Use:</h4>
					
					<div class="space-y-3">
						<div>
							<h5 class="text-sm font-medium text-[#00ccba]">Browser Cookies</h5>
							<p class="text-sm text-gray-400">
								A cookie is a small file placed on your Device. You can instruct your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if you do not accept Cookies, you may not be able to use some parts of our Service.
							</p>
						</div>
						
						<div>
							<h5 class="text-sm font-medium text-[#00ccba]">Session vs Persistent Cookies</h5>
							<p class="text-sm text-gray-400">
								Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on your personal computer or mobile device when you go offline, while Session Cookies are deleted as soon as you close your web browser.
							</p>
						</div>
						
						<div>
							<h5 class="text-sm font-medium text-[#00ccba]">Web Beacons</h5>
							<p class="text-sm text-gray-400">
								Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics.
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Data Usage -->
			<div class="space-y-4">
				<h3 class="text-base text-center font-semibold text-[#00ccba]">How We Use Your Data</h3>
				<p class="text-gray-300 text-sm leading-relaxed">
					The technologies we use may include cookies for improving our Service, recording the popularity of certain sections, and verifying system and server integrity. Unless you have adjusted your browser setting so that it will refuse Cookies, our Service may use Cookies.
				</p>
			</div>

			<!-- Contact Information -->
			<div class="space-y-4 bg-[#0a0a0a] border border-[#333333] rounded-lg p-4">
				<h3 class="text-base text-center font-semibold text-[#00ccba]">Contact Us</h3>
				<p class="text-gray-300 text-sm leading-relaxed">
					If you have any questions about this Privacy Policy, please contact us through our community channels or visit our main website for more information.
				</p>
			</div>
		</div>

		<!-- Back Navigation -->
		<div class="border-t border-[#333333] pt-6">
			<button
				class="w-full flex items-center justify-center gap-2 text-sm rounded-lg bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] border border-[#333333] px-4 py-2 text-white font-medium transition-all duration-200 hover:from-[#3a3a3a] hover:to-[#2a2a2a] group"
				onclick={() => goto('/about-us')}
			>
				<svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
				</svg>
				Back to About Us
			</button>
		</div>
	</div>
</section>

<style>
	.privacy-policy-scroll::-webkit-scrollbar {
		width: 6px;
	}

	.privacy-policy-scroll::-webkit-scrollbar-track {
		background: transparent;
		border-radius: 10px;
	}

	.privacy-policy-scroll::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #00ccba 0%, #00eeda 100%);
		border-radius: 10px;
		opacity: 0.7;
		transition: all 0.3s ease;
	}

	.privacy-policy-scroll::-webkit-scrollbar-thumb:hover {
		opacity: 1;
		box-shadow: 0 0 10px rgba(0, 204, 186, 0.5);
	}

	.privacy-policy-scroll::-webkit-scrollbar-corner {
		background: transparent;
	}
</style>
