<script lang="ts" context="module">
	import { load } from './_load';

	export { load };
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import '../app.css';

	export let logoutUrl: string;
	setContext('logoutUrl', logoutUrl);
</script>

<slot />
