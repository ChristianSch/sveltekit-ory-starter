// https://kit.svelte.dev/docs#hooks

import { authApi } from '$lib/auth';
import { config } from '$lib/constants';
import type { GetSession, Handle } from '@sveltejs/kit/types/hooks';

/*
  this session object is exposed to users
  only include properties needed on the client, like email and name — no token stuff
*/
export const getSession: GetSession = (request) => ({
	user: request.locals.session && {
		id: request.locals.session.identity.id,
		email: request.locals.session?.identity?.traits.email,
		verified: request.locals.session?.identity?.verifiable_addresses[0].verified || false
	}
});

export const handle: Handle = async ({ request, resolve }) => {
	try {
		const { status, data } = await authApi.toSession(undefined, 'session', {
			headers: {
				Authorization: `${request.headers.authorization}`,
				Cookie: `${request.headers.cookie}`,
				Origin: config.auth.publicUrl
			},
			credentials: 'include'
		});

		if (status === 401) {
			request.locals.session = undefined;
			return await resolve(request);
		}

		request.locals.session = data;

		const response = await resolve(request);

		return {
			...response,
			headers: {
				...response.headers
			}
		};
	} catch (error) {
		return await resolve(request);
	}
};
