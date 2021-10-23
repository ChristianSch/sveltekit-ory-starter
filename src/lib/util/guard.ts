import type { LoadInput } from '@sveltejs/kit';

export const loginRedirect = { status: 302, redirect: '/auth/login' };

export const canAccess = ({ page, session }: Partial<LoadInput>): boolean => {
	if (page.path === '/auth/login') return true;
	if (!session || !session.user) return false;
	return true;
};
