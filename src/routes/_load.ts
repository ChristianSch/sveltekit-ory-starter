import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ session, fetch }) => {
	if (!session.user) return {};

	const result = await fetch(`/api/auth/logout`, {
		credentials: 'include'
	});

	const { data } = await result.json();
	return {
		props: {
			logoutUrl: data.logout_url
		}
	};
};
