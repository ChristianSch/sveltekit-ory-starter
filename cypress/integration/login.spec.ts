import { LOGIN_FIELDS } from '../config';
import { generate } from '../utils';

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

	it('should have a fillable email field', () => {
		cy.getByTestId(LOGIN_FIELDS.email)
			.should('not.be.disabled')
			.type('foo', { force: true })
			.should('have.value', 'foo');
	});

	it('should have a fillable password field', () => {
		cy.getByTestId(LOGIN_FIELDS.password).type('bar').should('have.value', 'bar');
	});

	it('should let the user toggle password visibility', () => {
		cy.getByTestId(LOGIN_FIELDS.password_toggle).contains('Show');
		cy.getByTestId(LOGIN_FIELDS.password_toggle).click();
		cy.getByTestId(LOGIN_FIELDS.password_toggle).contains('Hide');
	});

	it('should have a login button with "Log in" text', () => {
		cy.getByTestId(LOGIN_FIELDS.submit).contains('Log in');
	});

	it('should log in successfully if correct information is entered', () => {
		cy.login(registrationData.email, registrationData.password);
	});
});
