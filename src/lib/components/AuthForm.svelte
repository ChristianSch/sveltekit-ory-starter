<script lang="ts">
	import type { UiContainer, UiNodeInputAttributes } from '@ory/kratos-client';
	export let label: string;
	export let authUi: UiContainer;
	export let onSubmit: () => void;

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
>
	{#each authUi.nodes as { messages, attributes }}
		{#if 'name' in attributes}
			<div>
				{#if attributes.name === 'password_identifier' || attributes.name === 'traits.email'}
					<label for="email">Email</label>
					<input
						bind:value={fields[attributes.name]}
						type="email"
						name="email"
						id="email"
						placeholder="example@domain.com"
					/>
				{/if}
				{#if attributes.name === 'password'}
					<label for="password">Password</label>
					<input
						bind:value={fields[attributes.name]}
						type="password"
						name="password"
						id="password"
					/>
				{/if}
				{#if attributes.name === 'csrf_token'}
					<input bind:value={fields[attributes.name]} type="hidden" name={attributes.name} />
				{/if}
			</div>
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
	<input type="submit" value={label} />
</form>

<style>
	input {
		border: 1px solid #000;
	}
</style>
