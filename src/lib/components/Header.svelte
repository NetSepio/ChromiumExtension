<script>
	const handleLogOut = () => {
		localStorage.clear();
		window.location.href = '/login-wallet';
	};
</script>

<div>
	<div class="navbar rounded-lg shadow-lg shadow-gray-500/50 p-5">
		<div class="flex-1">
			<a class="normal-case text-xl" href="#/DashboardHome"> Netsepio </a>
		</div>
		<div class="flex-none rounded-lg shadow-lg">
			<ul class="menu menu-horizontal px-1">
				<li>
					<a href="/WalletHome" class="hover:bg-gray-600 active:bg-gray-700 hover:text-white">
						Wallet
					</a>
				</li>
				<li tabIndex={0}>
					<button class="ml-1 hover:bg-gray-600 active:bg-gray-700 hover:text-gray-200">
						More
						<svg
							class="fill-current"
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
						>
							<path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
						</svg>
					</button>
					<ul class="p-2 bg-slate-100">
						<li>
							<a href="/dashboard" class="hover:bg-gray-600 hover:text-gray-200 active:bg-gray-200">
								Dashboard
							</a>
						</li>
						<li>
							<a href="/profile" class="hover:bg-gray-600 hover:text-gray-200 active:bg-gray-200">
								Profile
							</a>
						</li>
						<li>
							<a href="/settings" class="hover:bg-gray-600 hover:text-gray-200 active:bg-gray-200">
								Settings
							</a>
						</li>
						<li>
							<a href="/feedback" class="hover:bg-gray-600 hover:text-gray-200 active:bg-gray-200">
								Help & Feedback
							</a>
						</li>
						<li>
							<button
								on:click={handleLogOut}
								class="hover:bg-gray-600 hover:text-gray-200 active:bg-gray-200"
							>
								Logout
							</button>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
</div>
