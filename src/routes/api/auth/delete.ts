import { authApi } from '$lib/auth';

/*
 Note that while user deletion is implemented as a Svelte Kit endpoint here,
 chances are you'll want to call this from your own API or use kratos webhooks
 to clean up any associated user data your app may have stored.
*/
export const del = async (request: Request) => {
	const { userId } = JSON.parse(request.body as unknown as string);

	// Make sure no shenanigans are going on
	const { data } = await authApi.adminGetIdentity(userId);
	if (userId !== data.id) {
		return {
			status: 404,
			body: {
				error: 'User not found'
			}
		};
	}

	await authApi.adminDeleteIdentity(userId);
	return {
		status: 204,
		body: { id: userId }
	};
};
