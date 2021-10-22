import { authApi } from '$lib/auth';
import type { SelfServiceLogoutUrl } from '@ory/kratos-client';
import type { Request } from '@sveltejs/kit';

interface GetResponse {
	body: {
		data: SelfServiceLogoutUrl | string;
	};
	status: number;
	headers: {
		[key: string]: string;
	};
}

export const get = async (req: Request): Promise<GetResponse> => {
	const cookies = req.headers.cookie;

	try {
		const response = await authApi.createSelfServiceLogoutFlowUrlForBrowsers(cookies);
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
				data: `Could not get logout URL: ${err.response.data.error.message}`
			}
		};
	}
};
