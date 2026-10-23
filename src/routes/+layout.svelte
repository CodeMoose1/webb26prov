<script lang="ts">
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<top>
	<a href="/">start</a>
	<a href="/login">login</a>
	<a href="/register">register</a>
</top>

{@render children()}
