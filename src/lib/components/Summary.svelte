<script lang="ts">
	import OpenAI from 'openai';
	import { PUBLIC_OPENAI_KEY } from '$env/static/public';
	import { onMount } from 'svelte';

	// export let url: string;
	export let url: string;

	const openai = new OpenAI({
		apiKey: PUBLIC_OPENAI_KEY,
		dangerouslyAllowBrowser: true
	});

	// // Create assistant
	// openai.beta.assistants.create({
	// 	name: 'Netsepio Website Summary author',
	// 	instructions: 'You are to summarize what a website does',
	// 	model: 'gpt-3.5-turbo-1106',
	// 	tools: [
	// 		{
	// 			type: 'retrieval'
	// 		}
	// 	]
	// });

	const getWebSummary = async () => {
		// Retrieve Assistant
		const assistant = await openai.beta.assistants.retrieve('asst_ql9zGVcypf5zKHeRwbd8TsCM');
		const thread = await openai.beta.threads.create();

		//Create Message
		const createMessage = await openai.beta.threads.messages.create(thread?.id, {
			role: 'user',
			content: 'Summarize this website "google.com"'
		});

		// Run Assistant
		const run = await openai.beta.threads.runs.create(thread?.id, {
			assistant_id: assistant?.id,
			instructions:
				'Reply as if the user is just finding out about the website for the first time and the summary must be between 350 - 500 words, nothing more, nothing less.'
		});

		const retrieveStatus = await openai.beta.threads.runs.retrieve(thread?.id, run?.id);
		console.log(retrieveStatus);

		const messages = await openai.beta.threads.messages.list(thread?.id);
		messages?.body?.data.forEach((message) => {
			console.log(message?.content);
		});
	};

	// onMount(() => getWebSummary());
</script>

<div class="reviews">
	{url}
	<p>
		Netsepio is a cybersecurity platform specializing in threat intelligence and risk assessment.
		Their services empower businesses to proactively identify and mitigate potential security
		threats, ensuring robust protection for digital assets and sensitive information in an
		ever-evolving digital landscape.
	</p>
</div>
