<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	const isNotFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{isNotFound ? 'Page not found' : 'Something went wrong'} · Cubing</title>
</svelte:head>

<main class="error-page">
	<section class="error-message">
		<span>{page.status}</span>
		<h1>{isNotFound ? 'Nothing here.' : 'Something went wrong.'}</h1>
		<p>
			{isNotFound ? 'The page you’re looking for doesn’t exist.' : 'Please try again in a moment.'}
		</p>
		<a href={resolve('/')}>Back home</a>
	</section>
</main>
