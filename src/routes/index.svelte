<script lang="ts">
	import { getContext } from 'svelte';
	import { user } from '$lib/stores/auth';

	const logoutUrl: string = getContext('logoutUrl');
</script>

{#if $user}
	<h1>You're logged in! {$user.email}</h1>
	<a href="/settings">Account settings</a><br />
	<a href={logoutUrl}>Log out</a>
{:else}
	<h1>You're not logged in</h1>
	<a href="/auth/login">Log in now</a>
{/if}

<style>
	a {
		color: tomato;
	}
</style>
