<script lang="ts" context="module">
	import { createLoad } from './_load';
	export const load = createLoad('recovery');
</script>

<script lang="ts">
	import AuthForm from '$lib/components/AuthForm.svelte';
	import type { UiContainer } from '@ory/kratos-client';

	export let authUi: UiContainer;

	$: ui = authUi;
</script>

<h1>Reset your password</h1>

<AuthForm label="Reset password" authUi={ui} />
