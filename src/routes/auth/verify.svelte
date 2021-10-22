<script lang="ts" context="module">
	import { createLoad } from './_load';
	export const load = createLoad('verification');
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import type { UiContainer } from '@ory/kratos-client';

	export let authUi: UiContainer;

	$: ui = authUi;

	let verificationError = false;
	$: if (authUi && authUi.messages.length > 0) {
		const errorCode = authUi.messages[0].id;
		// https://www.ory.sh/kratos/docs/concepts/ui-user-interface/#messages
		const firstDigit = Number(String(errorCode).charAt(0));
		if (firstDigit === 4) verificationError = true;
		// TODO pass error
		else goto('/');
	}
</script>

{#if verificationError}
	<p>Looks like this link has expired, is inactive or invalid. Please request a new one!</p>
{:else}
	<p>Verifying your account</p>
{/if}
