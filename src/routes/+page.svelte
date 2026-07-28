<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>3×3 Speedcubing Tools | Cubing</title>
	<meta
		name="description"
		content="Practice all 57 OLL cases and all 21 PLL cases with focused Rubik's Cube 3×3 speedsolving trainers."
	/>
	<link rel="canonical" href="https://cubing.mutex.nyc/" />
</svelte:head>

<main class="home">
	<section class="home-content">
		<h1 class="home-brand">
			<span class="brand-mark"></span>
			<span>CUBING</span>
		</h1>

		<nav class="trainer-list" aria-label="Cubing trainers">
			<a class="trainer-link" href={resolve('/oll-trainer')}>
				<span>OLL Trainer</span>
				<span class="trainer-link-arrow" aria-hidden="true">→</span>
			</a>
			<a class="trainer-link" href={resolve('/pll-trainer')}>
				<span>PLL Trainer</span>
				<span class="trainer-link-arrow" aria-hidden="true">→</span>
			</a>
		</nav>
	</section>
</main>
