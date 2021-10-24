import { LOGIN_FIELDS } from '../config';
import { generate } from '../support/commands';

describe('Login', () => {
	const registrationData = generate.registrationData();
	before(() => {
		cy.register(registrationData.email, registrationData.password);
		cy.logout();
	});

	beforeEach(() => {
		cy.visit('/auth/login');
	});

	it('should follow redirects and have an active flow after', () => {
		cy.url().should('include', '?flow=');
	});

	it('has a fillable email field', () => {
		cy.getByTestId(LOGIN_FIELDS.email).type('foo').should('have.value', 'foo');
	});

	it('has a fillable password field', () => {
		cy.getByTestId(LOGIN_FIELDS.password).type('bar').should('have.value', 'bar');
	});

	it('has a login button with "Log in" text', () => {
		cy.getByTestId(LOGIN_FIELDS.submit).contains('Log in');
	});

	it('logs in successfully if correct information is entered', () => {
		cy.login(registrationData.email, registrationData.password);
	});
});
