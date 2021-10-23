<script lang="ts" context="module">
	import { canAccess, loginRedirect } from '$lib/util';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ page, session }) => {
		if (!canAccess({ page, session })) return loginRedirect;

		// Do whatever other `load` logic you need here
		return {
			props: {}
		};
	};
</script>

You're viewing this page, so that means you must be logged in :)
