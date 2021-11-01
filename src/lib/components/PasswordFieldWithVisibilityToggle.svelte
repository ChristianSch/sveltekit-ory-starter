<script lang="ts">
	import type { FlowTypeId } from '$lib/auth';
	import { Eye, EyeOff } from '$lib/components/icon';

	export let authType: FlowTypeId = null;
	export let value: string;
	export let name = 'password';
	export let id = 'password';
	export let testId = 'auth-password';

	let textIsVisible = false;
	const toggleTextVisibility = () => {
		textIsVisible = !textIsVisible;
	};
</script>

<div class="password-container">
	<!-- Cannot use two-way binding here because input type is dynamic -->
	<input
		{value}
		on:input
		type={!textIsVisible ? 'password' : 'text'}
		{name}
		{id}
		data-testid={testId}
		autocomplete={authType === 'registration' ? 'new-password' : 'current-password'}
	/>
	<button
		class="toggle-password"
		type="button"
		on:click={toggleTextVisibility}
		aria-label={!textIsVisible
			? 'Show password as plain text. Warning: this will display your password on the screen.'
			: 'Hide password'}
		data-testid="auth-password-toggle"
	>
		{#if !textIsVisible}
			<i aria-hidden="true"><Eye /></i> Show
		{:else}
			<i aria-hidden="true"><EyeOff /></i> Hide
		{/if}
	</button>
</div>

<style>
	.password-container {
		position: relative;
		display: inline-block;
	}

	input {
		padding: 5px 8px;
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
		width: 18px;
		height: 18px;
	}

	.toggle-password > i :global(svg) {
		height: 100%;
		width: 100%;
	}
</style>
