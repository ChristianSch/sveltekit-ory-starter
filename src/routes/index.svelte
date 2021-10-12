<script lang="ts">
	import { session } from '$app/stores';
</script>

{#if $session.user}
	<h1>You're logged in! {$session.user.email}</h1>
{:else}
	<h1>You're not logged in</h1>
	<a href="/auth/login">Log in now</a>
{/if}

<style>
	a {
		color: tomato;
	}
</style>
