<script lang="ts">
	import type { UiContainer, UiNodeInputAttributes } from '@ory/kratos-client';
	import type { FlowTypeId } from '$lib/auth';
	export let authUi: UiContainer;
	export let label: string;
	export let onSubmit: () => void = null;
	export let type: FlowTypeId = null;

	import { Eye, EyeOff } from '$lib/components/icon';
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

	let passwordFields = {};
	const togglePassword = (id: number) => {
		// basic true/false toggle for this field
		passwordFields[id] = !passwordFields[id];
	};

	$: socials = authUi ? authUi.nodes.filter((node) => node.group === 'oidc') : [];
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
					<div class="input-container">
						<button
							class="toggle-password"
							type="button"
							on:click={() => togglePassword(i)}
							aria-label={passwordFields[i]
								? 'Show password as plain text. Warning: this will display your password on the screen.'
								: 'Hide password'}
							data-testid="auth-password-toggle"
						>
							{#if passwordFields[i]}
								<i aria-hidden="true"><Eye /></i> Show
							{:else}
								<i aria-hidden="true"><EyeOff /></i> Hide
							{/if}
						</button>
						<!-- Cannot use two-way binding here because input type is dynamic -->
						<input
							value={fields[attributes.name]}
							on:input={(e) => updatePasswordValue(e, attributes.name)}
							bind:this={passwordFields[i]}
							type={passwordFields[i] ? 'password' : 'text'}
							name="password"
							id="password"
							data-testid="auth-password"
							autocomplete={type === 'registration' ? 'new-password' : 'current-password'}
						/>
					</div>
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
		{#if messages && messages.length > 0}
			{#each messages as { text, type }}
				{text}
			{/each}
		{/if}
	{/each}
	{#if authUi.messages && authUi.messages.length > 0}
		{#each authUi.messages as { text, type }}
			{text}
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
		border: 1px solid #000;
		padding: 5px 8px;
	}

	.input-container {
		position: relative;
		display: inline-block;
	}

	.toggle-password {
		background: none;
		border: none;
		cursor: pointer;
		font-weight: 300;
		position: absolute;
		height: 24px;
		top: calc(50% - 12px);
		right: 2px;
		padding: 5px 5px 5px 10px;
		line-height: 16px;
		display: flex;
		align-items: center;
		background: #fff;
	}

	.toggle-password > i {
		margin-right: 4px;
	}
</style>
