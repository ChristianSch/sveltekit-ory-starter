// https://kit.svelte.dev/docs#hooks

import { publicAuthApi } from '$lib/auth';
import { config } from '$lib/constants';
import type { GetSession, Handle } from '@sveltejs/kit/types/hooks';

export const getSession: GetSession = (request) => {
	/*
    this session object is exposed to users
    only include properties needed on the client, like email and name — no token stuff
  */
	return {
		user: request.locals.session && {
			id: request.locals.session.identity.id,
			email: request.locals.session?.identity?.traits.email
		}
	};
};

export const handle: Handle = async ({ request, resolve }) => {
	try {
		const { data } = await publicAuthApi.toSession(undefined, 'session', {
			headers: {
				Authorization: `${request.headers.authorization}`,
				Cookie: `${request.headers.cookie}`,
				Origin: config.auth.publicURL
			},
			credentials: 'include'
		});

		request.locals.session = data;

		const response = await resolve(request);

		return {
			...response,
			headers: {
				...response.headers
			}
		};
	} catch (error) {
		// console.log('hooks error', error.response.data.error);
		if (error.response.data.error.code === 401) {
			return await resolve(request);
		}
	}
};
