<script lang="ts" context="module">
	import { canAccess, loginRedirect } from '$lib/util';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page, session, fetch }) => {
		if (!canAccess({ page, session })) return loginRedirect;

		const settingsFlowResult = await fetch(`/api/auth/initiate-settings`, {
			credentials: 'include'
		});

		if (settingsFlowResult.ok) {
			const { data } = await settingsFlowResult.json();
			return {
				props: { authUi: data.ui }
			};
		}

		return {};
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/auth';
	import { getMessage } from '$lib/util';
	import PasswordField from '$lib/components/PasswordFieldWithVisibilityToggle.svelte';
	import type { UiContainer, UiNodeInputAttributes } from '@ory/kratos-client';

	export let authUi: UiContainer;

	let fields = authUi.nodes.reduce((acc, node) => {
		const { name, value } = node.attributes as UiNodeInputAttributes;
		acc[name] = {
			value: value || '',
			message: node.messages.length > 0 ? getMessage(node.messages[0]) : null
		};
		return acc;
	}, {});

	$: ui = authUi;
	const updatePasswordValue = (e) => {
		fields['password'].value = e.target.value;
	};

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

	$: formMessage = ui.messages && ui.messages.length > 0 ? getMessage(ui.messages[0]) : null;
</script>

<h1>Account settings</h1>

<form action={ui.action} method={ui.method} enctype="application/x-www-form-urlencoded">
	<div>
		<input bind:value={fields['csrf_token'].value} type="hidden" name="csrf_token" />

		<label for="email">Change your email</label>
		<input
			bind:value={fields['traits.email'].value}
			type="email"
			id="email"
			name="traits.email"
			placeholder="example@domain.com"
			data-testid="settings-email"
		/>
		<button type="submit" name="method" value="profile" data-testid="settings-email-submit">
			Update email
		</button>
		{#if fields['traits.email'].message}
			<p>{fields['traits.email'].message}</p>
		{/if}
	</div>
</form>

<form action={ui.action} method={ui.method} enctype="application/x-www-form-urlencoded">
	<input bind:value={fields['csrf_token'].value} type="hidden" name="csrf_token" />

	<div>
		<label for="email">Change your password</label>
		<PasswordField
			on:input={updatePasswordValue}
			value={fields['password'].value}
			name="password"
			id="password"
			testId="settings-password"
		/>
		<button type="submit" name="method" value="password" data-testid="settings-password-submit">
			Change password
		</button>
		{#if fields['password'].message}
			<p>{fields['password'].message}</p>
		{/if}
	</div>
</form>

{#if formMessage}
	<p>{formMessage}</p>
{/if}

<p>Danger zone:</p>
<button on:click={deleteUser} data-testid="settings-delete-account">Delete your account</button>

<style>
	form > div {
		margin-bottom: 30px;
	}
	input {
		padding: 5px 8px;
	}
</style>
