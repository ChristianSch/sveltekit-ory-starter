import type { Load } from '@sveltejs/kit';
import type { UserSession } from '$lib/auth';

export const load: Load = async ({ session }: { session: UserSession }) => {
	if (session.user) {
		return {
			props: {
				session
			}
		};
	}

	return {
		status: 302,
		redirect: '/auth/login'
	};
};
