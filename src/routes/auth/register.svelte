<script lang="ts" context="module">
	import { createLoad } from './_load';
	export const load = createLoad('registration');
</script>

<script lang="ts">
	import AuthForm from '$lib/components/AuthForm.svelte';
	import type { UiContainer } from '@ory/kratos-client';

	export let authUi: UiContainer;

	$: ui = authUi;
</script>

<h1>This is the register page!</h1>

<AuthForm label="Register" authUi={ui} />
<p>
	Already have an account? <a href="/auth/login">Log in</a>
</p>
