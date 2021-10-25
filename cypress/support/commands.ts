/// <reference types="cypress" />

import faker from 'faker';
import { REGISTER_FIELDS, LOGIN_FIELDS } from '../config';

export const urlWithExactPath = (path: string) => Cypress.config().baseUrl + path;

export const generate = {
	email: () => faker.internet.email(),
	password: (len?: number) => faker.internet.password(len || 16),
	registrationData: () => ({
		email: faker.internet.email(),
		password: faker.internet.password(16)
	})
};

Cypress.Commands.add('getByTestId', (selector, ...args) => {
	return cy.get(`[data-testid=${selector}]`, ...args);
});

const register = (email?: string, password?: string) => {
	const data = generate.registrationData();
	cy.visit('/auth/register');
	cy.getByTestId(REGISTER_FIELDS.email).type(email || data.email);
	cy.getByTestId(REGISTER_FIELDS.password).type(password || data.password);
	cy.getByTestId(REGISTER_FIELDS.submit).click();

	cy.url().should('eq', urlWithExactPath('/'));
};
Cypress.Commands.add('register', register);

const logout = () => {
	cy.clearCookies();
};
Cypress.Commands.add('logout', logout);

const login = (email: string, password: string) => {
	cy.session([email, password], () => {
		cy.visit('/auth/login');
		cy.getByTestId(LOGIN_FIELDS.email).type(email);
		cy.getByTestId(LOGIN_FIELDS.password).type(password);
		cy.getByTestId(LOGIN_FIELDS.submit).click();

		cy.url().should('eq', urlWithExactPath('/'));
	});
};
Cypress.Commands.add('login', login);

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			getByTestId(value: string): Chainable<Element>;
			register: typeof register;
			login: typeof login;
			logout: typeof logout;
		}
	}
}
