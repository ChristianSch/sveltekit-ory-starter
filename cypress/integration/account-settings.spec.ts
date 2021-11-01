import { SETTINGS_FIELDS, LOGIN_FIELDS } from '../config';
import { generate } from '../utils';

describe('Reset password', () => {
	const registrationData = generate.registrationData();
	before(() => {
		cy.register(registrationData.email, registrationData.password);
		cy.logout();
	});

	beforeEach(() => {
		cy.login(registrationData.email, registrationData.password);
		cy.visit('/settings');
	});

	it('should have all elements present to change account email', () => {
		cy.get('label').contains('Change your email');
		cy.getByTestId(SETTINGS_FIELDS.email).should('have.value', registrationData.email);
		cy.getByTestId(SETTINGS_FIELDS.email_submit).contains('Update email');
	});

	it('should update account email correctly', () => {
		const email = generate.email();
		cy.getByTestId(SETTINGS_FIELDS.email).clear().type(email);
		cy.getByTestId(SETTINGS_FIELDS.email_submit).click();

		cy.url().then((url) => {
			if (url.includes('/login')) cy.verifyIdentity(registrationData.password);
			cy.url().should('include', '/settings');
			cy.getByTestId(SETTINGS_FIELDS.email).should('have.value', email);
		});
	});

	it('should have all elements present to change account password', () => {
		cy.get('label').contains('Change your password');
		cy.getByTestId(SETTINGS_FIELDS.password).type('foo').should('have.value', 'foo');
		cy.getByTestId(SETTINGS_FIELDS.password_submit).contains('Change password');
	});

	it('should update account password correctly', () => {
		const password = generate.password();
		cy.getByTestId(SETTINGS_FIELDS.password).type(password);
		cy.getByTestId(SETTINGS_FIELDS.password_submit).click();

		cy.url().then((url) => {
			if (url.includes('/login')) cy.verifyIdentity(registrationData.password);
			cy.url().should('include', '/settings');
		});
	});

	it('should allow users to delete their account', () => {
		cy.on('window:confirm', (text) => {
			expect(text).to.equal('Are you sure you want to delete your account?');
		});

		const { email, password } = generate.registrationData();
		cy.logout();
		cy.register(email, password);

		cy.visit('/settings');
		cy.getByTestId(SETTINGS_FIELDS.delete_account).contains('Delete your account').click();
		cy.url().should('include', '/auth/login');
		cy.visit('/auth/login');
		cy.getByTestId(LOGIN_FIELDS.email).type(email);
		cy.getByTestId(LOGIN_FIELDS.password).type(password);
		cy.getByTestId(LOGIN_FIELDS.submit).click();
		cy.contains('The password or email you entered was incorrect');
	});
});
