<script lang="ts">
	import { dev } from '$app/environment';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{#if !dev}
		<script
			defer
			src="https://umami.deguzman.cloud/script.js"
			data-website-id="44bbc683-5cf9-4275-8939-516f820937aa"
		></script>
	{/if}
</svelte:head>
{@render children()}
