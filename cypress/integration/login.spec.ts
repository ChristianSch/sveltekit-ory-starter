describe('Login', () => {
	beforeEach(() => {
		cy.visit('/auth/login');
	});

	it('should follow redirects and have an active flow after', () => {
		cy.url().should('include', '?flow=');
	});

	it('has a fillable email field', () => {
		cy.getByTestId('auth-email').type('foo').should('have.value', 'foo');
	});

	it('has a login button with "Log in" text', () => {
		cy.getByTestId('auth-submit').contains('Log in');
	});
});
