<script lang="ts">
	import { user } from '$lib/stores/auth';
</script>

{#if $user}
	<h1>You're logged in! {$user.email}</h1>
{:else}
	<h1>You're not logged in</h1>
	<a href="/auth/login">Log in now</a>
{/if}

<style>
	a {
		color: tomato;
	}
</style>
