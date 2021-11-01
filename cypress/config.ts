export const apiRoutes = {
	publicBase: Cypress.env('VITE_KRATOS_PUBLIC_URL') || 'http://127.0.0.1:4433',
	publicAdmin: Cypress.env('VITE_KRATOS_PUBLIC_URL') || 'http://127.0.0.1:4434',
	mail: Cypress.env('VITE_MAIL_API_URL') || 'http://127.0.0.1:4437',
	get register() {
		return `${this.publicBase}/self-service/registration`;
	},
	get whoami() {
		return `${this.publicBase}/sessions/whoami`;
	}
};

export enum LOGIN_FIELDS {
	email = 'auth-email',
	password = 'auth-password',
	password_toggle = 'auth-password-toggle',
	submit = 'auth-submit'
}

export enum REGISTER_FIELDS {
	email = 'auth-email',
	password = 'auth-password',
	password_toggle = 'auth-password-toggle',
	submit = 'auth-submit'
}

export enum RESET_PASSWORD_FIELDS {
	email = 'auth-email',
	submit = 'auth-submit'
}
