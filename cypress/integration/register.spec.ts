import { REGISTER_FIELDS } from '../config';
import { generate, urlWithExactPath } from '../utils';
import type { Email } from '../utils';

describe('Register', () => {
	beforeEach(() => {
		cy.visit('/auth/register').url().should('include', '?flow=');
	});

	it('should have a fillable email field', () => {
		cy.getByTestId(REGISTER_FIELDS.email).type('foo').should('have.value', 'foo');
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

	it('should send an account verification email', () => {
		const { email, password } = generate.registrationData();
		cy.register(email, password);
		const mailCriteria = (mail: Email) =>
			mail.subject.includes('Please verify your email address') && mail.toAddresses.includes(email);
		cy.waitForEmail(mailCriteria).then((verificationEmail: Email) => {
			cy.document().invoke('write', verificationEmail.body);
			cy.get('a').click();
			cy.url().should('eq', urlWithExactPath('/'));
		});
	});
});
