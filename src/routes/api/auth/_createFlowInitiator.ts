import { authApi } from '$lib/auth';
import type { SelfServiceLogoutUrl, SelfServiceSettingsFlow } from '@ory/kratos-client';
import type { Request } from '@sveltejs/kit';

interface GetResponse {
	body: {
		data: SelfServiceLogoutUrl | SelfServiceSettingsFlow | string;
	};
	status: number;
	headers: {
		[key: string]: string;
	};
}

export const createInitiator = (method: string) => {
	return async (req: Request): Promise<GetResponse> => {
		const cookies = req.headers.cookie;

		try {
			const response = await authApi[method](cookies);
			return {
				body: {
					data: response.data
				},
				headers: {
					'Content-Type': 'application/json'
				},
				status: response.status
			};
		} catch (err) {
			return {
				status: err.response.data.error.code,
				headers: {
					'Content-Type': 'application/json'
				},
				body: {
					data: `Could not initiate flow: ${err.response.data.error.message}`
				}
			};
		}
	};
};
