<script lang="ts">
	import type { UiContainer, UiNodeInputAttributes } from '@ory/kratos-client';
	import type { FlowTypeId } from '$lib/auth';
	export let authUi: UiContainer;
	export let label: string;
	export let onSubmit: () => void = null;
	export let type: FlowTypeId = null;

	import { getMessage } from '$lib/util';
	import PasswordFieldWithVisibilityToggle from './PasswordFieldWithVisibilityToggle.svelte';
	/*
    Populates an object for every node that was returned by Ory Kratos and sets
    its default value if there is one. Allows for easy serialization to submit via
    fetch (if JS is enabled, will revert to plain HTML form submit if it isn't)
  */
	let fields = authUi.nodes.reduce((acc, node) => {
		const { name, value } = node.attributes as UiNodeInputAttributes;
		acc[name] = value || '';
		return acc;
	}, {});

	const submit = (event) => {
		// if (onSubmit) onSubmit(fields);
		let valid = true;
		// do form validation based on your preferences/business requirements
		if (onSubmit) onSubmit();
		if (!valid) event.preventDefault();
	};

	const updatePasswordValue = (e, fieldName: string) => {
		fields[fieldName] = e.target.value;
	};

	$: socials = authUi ? authUi.nodes.filter((node) => node.group === 'oidc') : [];
	$: formErrors = authUi.messages
		? authUi.messages.filter((m) => m.type === 'error').map((e) => getMessage(e))
		: [];
	$: formInfo = authUi.messages
		? authUi.messages.filter((m) => m.type === 'info').map((e) => getMessage(e))
		: [];
</script>

<!--
  Ory Kratos will return a lot of data (type, value, disabled) in `authUi` that is
  useful to make form construction even more dynamic, but this structure allows for i18n
  and more fine-grained styling etc.
-->
<form
	action={authUi.action}
	method={authUi.method}
	enctype="application/x-www-form-urlencoded"
	on:submit={submit}
	{...$$restProps}
>
	{#each authUi.nodes as { messages, attributes }, i}
		{#if 'name' in attributes}
			<div>
				{#if attributes.type === 'email' || attributes.name === 'password_identifier' || attributes.name === 'traits.email'}
					<label for="email">Email</label>
					<input
						bind:value={fields[attributes.name]}
						type="email"
						name={attributes.name}
						id="email"
						placeholder="example@domain.com"
						data-testid="auth-email"
					/>
				{/if}
				{#if attributes.name === 'password'}
					<label for="password">Password</label>
					<PasswordFieldWithVisibilityToggle
						value={fields[attributes.name]}
						name="password"
						id="password"
						data-testid="auth-password"
						on:input={(e) => updatePasswordValue(e, attributes.name)}
					/>
				{/if}
				{#if attributes.name === 'csrf_token'}
					<input
						data-testid="auth-csrf"
						bind:value={fields[attributes.name]}
						type="hidden"
						name={attributes.name}
					/>
				{/if}
			</div>
			{#if attributes.type === 'submit' && attributes.name !== 'provider'}
				<button
					data-testid="auth-submit"
					type="submit"
					name={attributes.name}
					value={attributes.value}>{label}</button
				>
			{/if}
		{/if}
		<!-- Field errors -->
		{#if messages && messages.length > 0}
			{#each messages.map((m) => getMessage(m)) as message}
				{message}
			{/each}
		{/if}
	{/each}
	{#if formErrors && formErrors.length > 0}
		{#each formErrors as error}
			<p>{error}</p>
		{/each}
	{/if}
	<!-- Info -->
	{#if formInfo && formInfo.length > 0}
		{#each formInfo as info}
			<p>{info}</p>
		{/each}
	{/if}
</form>

{#if socials.length > 0}
	or
	<form action={authUi.action} method={authUi.method} enctype="application/x-www-form-urlencoded">
		{#each socials as { attributes }}
			<!--
        You can add styling based on the provider by checking
        `if (attributes.value === '<provider')`
      -->
			{#if 'name' in attributes}
				<button type="submit" name={attributes.name} value={attributes.value}>
					Sign in with
					{#if attributes.value === 'github'}
						GitHub
					{/if}
				</button>
			{/if}
		{/each}
	</form>
{/if}

<style>
	input {
		padding: 5px 8px;
	}
</style>
