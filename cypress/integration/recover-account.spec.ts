import { RESET_PASSWORD_FIELDS } from '../config';
import { generate, urlWithExactPath } from '../utils';
import type { Email } from '../utils';

describe('Recover account', () => {
	beforeEach(() => {
		cy.visit('/auth/reset-password');
		cy.url().should('include', '?flow=');
	});

	it('should have a fillable email field', () => {
		cy.getByTestId(RESET_PASSWORD_FIELDS.email).type('foo').should('have.value', 'foo');
	});

	it('should have a reset button with "Reset password" text', () => {
		cy.getByTestId(RESET_PASSWORD_FIELDS.submit).contains('Reset password');
	});

	it('should send a recovery email with a reset link', () => {
		const { email, password } = generate.registrationData();
		cy.register(email, password);
		cy.logout();
		cy.visit('/auth/reset-password');
		cy.getByTestId(RESET_PASSWORD_FIELDS.email).type(email);
		cy.getByTestId(RESET_PASSWORD_FIELDS.submit).click();

		const mailCriteria = (mail: Email) =>
			mail.subject.includes('Recover access to your account') && mail.toAddresses.includes(email);
		cy.waitForEmail(mailCriteria).then((resetEmail: Email) => {
			cy.document().invoke('write', resetEmail.body);
			cy.get('a').click();
			cy.url().should('include', urlWithExactPath('/settings'));
			cy.url().should('include', '?flow=');
		});
	});
});
