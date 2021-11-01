import { Configuration, V0alpha2Api } from '@ory/kratos-client';
import type {
	SelfServiceLoginFlow,
	SelfServiceRecoveryFlow,
	SelfServiceRegistrationFlow,
	SelfServiceSettingsFlow,
	SelfServiceVerificationFlow
} from '@ory/kratos-client';
import { config } from './constants';

export type TAuthFlow =
	| SelfServiceLoginFlow
	| SelfServiceRegistrationFlow
	| SelfServiceRecoveryFlow
	| SelfServiceSettingsFlow
	| SelfServiceVerificationFlow;

export type FlowTypeId =
	| 'registration'
	| 'login'
	| 'settings'
	| 'verification'
	| 'recovery'
	| 'error';

export interface UserSession {
	user: {
		id: string;
		email: string;
	};
}

export const authFlowMap = {
	registration: 'getSelfServiceRegistrationFlow',
	recovery: 'getSelfServiceRecoveryFlow',
	verification: 'getSelfServiceVerificationFlow',
	settings: 'getSelfServiceSettingsFlow',
	error: 'getSelfServiceError',
	login: 'getSelfServiceLoginFlow'
};

export const authApi = new V0alpha2Api(
	new Configuration({
		basePath: config.auth.publicUrl as string,
		baseOptions: {
			withCredentials: true
		}
	})
);
export const authAdminApi = new V0alpha2Api(
	new Configuration({
		basePath: config.auth.adminUrl as string,
		baseOptions: {
			withCredentials: true
		}
	})
);
