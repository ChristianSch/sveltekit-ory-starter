import { authApi, authFlowTypeMap } from '$lib/auth';
import type { Request } from '@sveltejs/kit';
import type {
	SelfServiceError,
	SelfServiceRegistrationFlow,
	SelfServiceVerificationFlow
} from '@ory/kratos-client';
import type { AuthFlowType } from '$lib/auth';

interface AuthFlowResponse {
	status: number;
	data: AuthFlowType | SelfServiceError;
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
		const authFlow = authFlowTypeMap[flowType];
		const { status, data }: AuthFlowResponse = await authApi[authFlow](flowParam, cookies);

		return {
			body: { data },
			status,
			headers: {
				'Content-Type': 'application/json'
			}
		};
	} catch (err) {
		if (err.response) console.error(err.response.data.error);
	}
};
