/// <reference types="cypress" />

import { REGISTER_FIELDS, LOGIN_FIELDS, apiRoutes } from '../config';
import { generate, urlWithExactPath } from '../utils';
import type { Email } from '../utils';

Cypress.Commands.add('getByTestId', (selector, ...args) => {
	return cy.get(`[data-testid=${selector}]`, ...args);
});

const register = (email?: string, password?: string) => {
	const data = generate.registrationData();
	cy.visit('/auth/register');
	cy.getByTestId(REGISTER_FIELDS.email)
		.should('not.be.disabled')
		.type(email || data.email);
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
			cy.log(mails);
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
		}
	}
}
