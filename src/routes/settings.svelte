<script lang="ts" context="module">
	import { isString } from '$lib/util';
	import { config } from '$lib/constants';
	import type { Load } from '@sveltejs/kit';
	import type { TAuthFlow } from '$lib/auth';

	export const load: Load = async ({ page, fetch }) => {
		const flowId = page.query.get('flow');

		if (!flowId || !isString(flowId)) {
			return {
				status: 302,
				redirect: `${config.auth.publicUrl}/self-service/settings/browser`
			};
		}

		try {
			const res = await fetch(`/api/auth/settings`, {
				headers: { flow_id: flowId },
				credentials: 'include'
			});
			const { data: flow }: { status: number; data: TAuthFlow } = await res.json();
			return {
				props: { authUi: flow.ui }
			};
		} catch (err) {
			// TODO: handle
			console.log(err);
		}

		return {};
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/auth';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import type { UiContainer } from '@ory/kratos-client';

	export let authUi: UiContainer;

	$: ui = authUi;

	const deleteUser = async () => {
		const isConfirmed = window.confirm('Are you sure you want to delete your account?');
		if (!isConfirmed) return;

		const res = await fetch('/api/auth/delete', {
			method: 'DELETE',
			credentials: 'include',
			body: JSON.stringify({ userId: $user.id })
		});

		if (res.ok) {
			// TODO: report success
			await goto('/auth/login');
		}

		// TODO: handle error
	};
</script>

<h1>Account settings</h1>

<AuthForm label="Reset password" authUi={ui} />

<button on:click={deleteUser}>Delete your account</button>
