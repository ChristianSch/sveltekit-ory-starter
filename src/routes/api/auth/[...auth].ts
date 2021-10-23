import { authApi, authFlowMap } from '$lib/auth';
import type { Request } from '@sveltejs/kit';
import type {
	SelfServiceError,
	SelfServiceRegistrationFlow,
	SelfServiceVerificationFlow
} from '@ory/kratos-client';
import type { TAuthFlow } from '$lib/auth';

interface AuthFlowResponse {
	status: number;
	data: TAuthFlow | SelfServiceError;
}

interface GetResponse {
	body: {
		data: SelfServiceRegistrationFlow | SelfServiceVerificationFlow | SelfServiceError;
	};
	status: number;
	headers: {
		[key: string]: string;
	};
}

export const get = async (req: Request): Promise<GetResponse> => {
	const flowId = req.headers.flow_id;
	const error = req.headers.error;
	const flowType = req.params.auth;
	const cookies = req.headers.cookie;
	const flowParam = flowType === 'error' ? error : flowId;
	try {
		const authFlow = authFlowMap[flowType];

		// For some reason, the settings flow has a unique function signature
		const promise =
			authFlow === authFlowMap.settings
				? authApi[authFlow](flowParam, null, cookies)
				: authApi[authFlow](flowParam, cookies);

		const { status, data }: AuthFlowResponse = await promise;

		return {
			body: { data },
			status,
			headers: {
				'Content-Type': 'application/json'
			}
		};
	} catch (err) {
		if (err.response && err.response.data) console.error(err.response.data.error);
	}
};
