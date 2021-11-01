/// <reference types="cypress" />

import { REGISTER_FIELDS, LOGIN_FIELDS, apiRoutes } from '../config';
import { generate, urlWithExactPath } from '../utils';
import type { Email } from '../utils';

Cypress.Commands.add('getByTestId', (selector, ...args) => {
	return cy.get(`[data-testid=${selector}]`, ...args);
});

const register = (email?: string, password?: string) => {
	const data = generate.registrationData();
	cy.visit('/auth/register').url().should('include', '?flow=');
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
		cy.visit('/auth/login').url().should('include', '?flow=');
		cy.getByTestId(LOGIN_FIELDS.email).type(email);
		cy.getByTestId(LOGIN_FIELDS.password).type(password);
		cy.getByTestId(LOGIN_FIELDS.submit).click();

		cy.url().should('eq', urlWithExactPath('/'));
	});
};
Cypress.Commands.add('login', login);

/*
	During some flows (such as settings) and under certain conditions, Ory Kratos
	will require identity verification by asking the user to re-enter their password.
	We don't control those conditions, and they are well-tested on Kratos' end.
	This helper will verify the identity if required by Kratos
*/
const verifyIdentity = (password: string) => {
	cy.contains("Please confirm this action by verifying that it's you.");
	cy.getByTestId(LOGIN_FIELDS.password).type(password);
	cy.getByTestId(LOGIN_FIELDS.submit).click();
};
Cypress.Commands.add('verifyIdentity', verifyIdentity);

const getEmails = () => {
	return cy.request(`${apiRoutes.mail}/mail`).then((response) => {
		expect(response.body).to.have.property('mailItems');
		const count = response.body.mailItems.length;
		expect(count).to.be.greaterThan(0);
		return response.body.mailItems;
	});
};
Cypress.Commands.add('getEmails', getEmails);

// mailCriteria is a function passed into `find` for all recent emails
const waitForEmail = (mailCriteria: (mail: Email) => boolean) => {
	let tries = 0;
	const doRequest = () =>
		cy.getEmails().then((mails) => {
			const found = mails.length && mails.length > 0 ? mails.find(mailCriteria) : null;
			if (tries < 10 && !found) {
				tries += 1;
				// waiting here is necessary, as we can't spy on mailslurper's
				// incoming email requests
				// eslint-disable-next-line cypress/no-unnecessary-waiting
				cy.wait(1000);
				return doRequest();
			}

			if (!found) {
				throw new Error('No matching email found');
			}

			return Promise.resolve(found);
		});
	return doRequest();
};
Cypress.Commands.add('waitForEmail', waitForEmail);

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			getByTestId(value: string): Chainable<Element>;
			register: typeof register;
			login: typeof login;
			logout: typeof logout;
			getEmails: typeof getEmails;
			waitForEmail: typeof waitForEmail;
			verifyIdentity: typeof verifyIdentity;
		}
	}
}
