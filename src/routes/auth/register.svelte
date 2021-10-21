<script lang="ts" context="module">
	import { createLoad } from './_load';
	export const load = createLoad('registration');
</script>

<script lang="ts">
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { authApi } from '$lib/auth';
	import type { UiContainer } from '@ory/kratos-client';

	export let authUi: UiContainer;

	$: ui = authUi;

	const register = async (fields) => {
		try {
			const response = await authApi.submitSelfServiceRegistrationFlow(
				$page.query.get('flow'),
				{ ...fields },
				{ withCredentials: true }
			);
			goto('/');
		} catch (err) {
			if (err.response.data.ui) ui = err.response.data.ui;
			else console.error(err);
		}
	};
</script>

<h1>This is the register page!</h1>

<AuthForm onSubmit={register} label="Register" authUi={ui} />

<p>
	Already have an account? <a href="/auth/login">Log in</a>
</p>
