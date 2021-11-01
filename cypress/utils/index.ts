import faker from 'faker';

export const urlWithExactPath = (path: string) => Cypress.config().baseUrl + path;

export const generate = {
	email: () => faker.internet.email(),
	password: (len?: number) => faker.internet.password(len || 16),
	registrationData: () => ({
		email: faker.internet.email(),
		password: faker.internet.password(16)
	})
};
