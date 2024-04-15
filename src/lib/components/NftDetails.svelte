<script lang="ts">
	export let title: string;
</script>

<h3 class="heading mb-[4%]">{title}</h3>
<div
	class="border border-appGray border-opacity-50 w-full min-h-[80px] flex flex-col items-center justify-center"
>
	<slot />
</div>
