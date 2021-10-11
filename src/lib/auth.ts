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

export type KratosFlowType =
	| 'registration'
	| 'login'
	| 'settings'
	| 'verification'
	| 'recovery'
	| 'error';

export const publicAuthApi = new V0alpha1Api(
	new Configuration({
		basePath: config.auth.publicURL as string
	})
);
