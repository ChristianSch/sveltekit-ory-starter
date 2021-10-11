import { Configuration, V0alpha1Api } from '@ory/kratos-client';
import type {
	SelfServiceLoginFlow,
	SelfServiceRecoveryFlow,
	SelfServiceRegistrationFlow,
	SelfServiceSettingsFlow,
	SelfServiceVerificationFlow
} from '@ory/kratos-client';
import { config } from './constants';

export type AuthFlowType =
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

export const authFlowTypeMap = {
	registration: 'getSelfServiceRegistrationFlow',
	recovery: 'getSelfServiceRecoveryFlow',
	verification: 'getSelfServiceVerificationFlow',
	settings: 'getSelfServiceSettingsFlow',
	error: 'getSelfServiceError',
	login: 'getSelfServiceLoginFlow'
};

export const authApi = new V0alpha1Api(
	new Configuration({ basePath: config.auth.publicURL as string })
);
