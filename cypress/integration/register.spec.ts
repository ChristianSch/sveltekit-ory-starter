import { REGISTER_FIELDS } from '../config';

describe('Register', () => {
	beforeEach(() => {
		cy.visit('/auth/register');
	});

	it('should follow redirects and have an active flow after', () => {
		cy.url().should('include', '?flow=');
	});

	it('should have a fillable email field', () => {
		cy.getByTestId(REGISTER_FIELDS.email)
			.should('not.be.disabled')
			.type('foo', { force: true })
			.should('have.value', 'foo');
	});

	it('should have a fillable password field', () => {
		cy.getByTestId(REGISTER_FIELDS.password).type('bar').should('have.value', 'bar');
	});

	it('should have a registration button with "Register" text', () => {
		cy.getByTestId(REGISTER_FIELDS.submit).contains('Register');
	});

	it('should register successfully when correct information is entered', () => {
		cy.register();
	});
});
