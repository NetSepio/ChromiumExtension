<script>
	import Header from '$lib/components/Header.svelte';
	import ChangePassword from '$lib/components/ChangePassword.svelte';
</script>

<div class="p-5 mb-5 pb-5">
	<Header />

	<br />
	<h1 class="text-5xl mt-5 mb-2 text-left">Settings</h1>

	<br />
	<div class="justify-center">
		<div
			class="block rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white p-5 w-auto h-auto hover:bg-slate-200 active:bg-slate-500"
		>
			<ChangePassword />
		</div>
	</div>
	<br />

	<br />
	<div class="justify-center">
		<div
			class="block rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white p-5 w-auto h-auto hover:bg-slate-200 active:bg-slate-500"
		>
			<a href="/settings" class="text-xl text-center"> Change Network </a>
		</div>
	</div>
	<br />

	<br />
	<div class="justify-center">
		<div
			class="block rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white p-5 w-auto h-auto hover:bg-slate-200 active:bg-slate-500"
		>
			<a href="/settings" class="text-xl text-center"> Auto Lock </a>
		</div>
	</div>
	<br />
	<!-- Show Secret Key -->
	<br />
	<div class="justify-center">
		<div
			class="block rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white p-5 w-auto h-auto hover:bg-slate-200 active:bg-slate-500"
		>
			<a href="/settings/show-secret-key" class="text-xl text-center">
				Show Secret Key
			</a>
		</div>
	</div>
	<br />
	<!-- Reset Secret Key -->
	<br />
	<div class="justify-center mb-10">
		<div
			class="block rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white p-5 w-auto h-auto hover:bg-slate-200 active:bg-slate-500"
		>
			<a href="/settings" class="text-xl text-center"> Reset Secret Key </a>
		</div>
	</div>
	<br />
</div>
