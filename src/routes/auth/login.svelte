<script lang="ts" context="module">
	import { createLoad } from './_load';
	export const load = createLoad('login');
</script>

<script lang="ts">
	import AuthForm from '$lib/components/AuthForm.svelte';
	import type { UiContainer } from '@ory/kratos-client';

	export let authUi: UiContainer;

	const login = () => {
		//
	};
	// const authMessages = authUi.messages;
</script>

<h1>This is the login page!</h1>

<AuthForm onSubmit={login} label="Login" {authUi} />
