<script>
	let selectedLanguage = '';
	let dropdownOpen = false;

	const languageOptions = [
		{ key: 'en', text: 'English', value: 'en' },
		{ key: 'fr', text: 'French', value: 'fr' },
		{ key: 'de', text: 'German', value: 'de' },
		{ key: 'es', text: 'Spanish', value: 'es' },
		{ key: 'it', text: 'Italian', value: 'it' }
	];

	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}
</script>

<div>
	<div class="dropdown dropdown-end float-right mb-48">
		<button tabindex="0" class="btn m-1" on:click={toggleDropdown}>
			{selectedLanguage || 'Language'}
		</button>
		{#if dropdownOpen}
			<button
				tabindex="0"
				class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 cursor-pointer"
			>
				{#each languageOptions as option}
					<li>
						<button on:click={() => (selectedLanguage = option.text)}>
							{option.text}
						</button>
					</li>
				{/each}
			</button>
		{/if}
	</div>
	<div>
		<h1 class="text-5xl text-left">Welcome to Netsepio</h1>
	</div>
	<div class="mt-10">
		<a href="/get-secret-key">
			<button class="btn btn-wide">New Wallet</button>
		</a>
		<div class="divider mr-5" />
		<a href="/import-old-wallet">
			<button class="btn btn-wide">Import Wallet</button>
		</a>
	</div>
</div>
