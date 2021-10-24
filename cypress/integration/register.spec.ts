import { REGISTER_FIELDS } from '../config';

describe('Register', () => {
	beforeEach(() => {
		cy.visit('/auth/register');
	});

	it('should follow redirects and have an active flow after', () => {
		cy.url().should('include', '?flow=');
	});

	it('has a fillable email field', () => {
		cy.getByTestId(REGISTER_FIELDS.email).type('foo').should('have.value', 'foo');
	});

	it('has a fillable password field', () => {
		cy.getByTestId(REGISTER_FIELDS.password).type('bar').should('have.value', 'bar');
	});

	it('has a registration button with "Register" text', () => {
		cy.getByTestId(REGISTER_FIELDS.submit).contains('Register');
	});

	it('registers successfully when correct information is entered', () => {
		cy.register();
	});
});
