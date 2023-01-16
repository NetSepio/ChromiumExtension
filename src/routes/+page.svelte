<script>
	import AboutPage from './about/+page.svelte';
</script>
	
<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div>
	<h1>Hello</h1>
	<svelte:component this={AboutPage} />
</div>