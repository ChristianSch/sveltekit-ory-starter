import { AuthMessage, getCustomMessage, getMessage, getMessageWithId } from './map-message';

describe('getCustomMessage', () => {
	test('should interpolate values correctly', () => {
		const messageId = AuthMessage.BAD_LENGTH_SUPPLIED;
		const interpolators = {
			field: 'email',
			expected_length: 5,
			actual_length: 2
		};
		const message = getCustomMessage(messageId, interpolators);
		expect(message).toEqual(
			`${interpolators.field} should be at least ${interpolators.expected_length} characters (currently ${interpolators.actual_length})`
		);
	});

	test('should return correct message if an empty interpolation object is passed', () => {
		const messageId = AuthMessage.INVALID_CREDENTIALS_SUPPLIED;
		const message = getCustomMessage(messageId, {});
		expect(message).toEqual('The password or email you entered was incorrect');
	});

	test('should return correct message if no interpolation object is passsed', () => {
		const messageId = AuthMessage.INVALID_CREDENTIALS_SUPPLIED;
		const message = getCustomMessage(messageId);
		expect(message).toEqual('The password or email you entered was incorrect');
	});
});

describe('getMessage', () => {
	test('should interpolate both contextual values and custom values', () => {
		const baseMessage = {
			id: AuthMessage.BAD_LENGTH_SUPPLIED,
			text: 'Length must be 5, but got 2',
			context: {
				actual_length: 2,
				expected_length: 5
			}
		};
		const message = getMessage(baseMessage, { field: 'Email' });
		expect(message).toEqual(`Email should be at least 5 characters (currently 2)`);
	});

	test('should interpolate custom values if no context exists on the message', () => {
		const baseMessage = {
			id: AuthMessage.BAD_LENGTH_SUPPLIED,
			text: 'Length must be 5, but got 2'
		};
		const message = getMessage(baseMessage, {
			field: 'Email',
			actual_length: 2,
			expected_length: 5
		});
		expect(message).toEqual(`Email should be at least 5 characters (currently 2)`);
	});

	test('should return the original message if no custom value is set', () => {
		const baseMessage = {
			id: 0,
			text: "This error is super obscure so we don't bother with it"
		};
		const message = getMessage(baseMessage);
		expect(message).toEqual(baseMessage.text);
	});
});

describe('getMessageWithId', () => {
	test('should return correct message', () => {
		const messageId = AuthMessage.INVALID_CREDENTIALS_SUPPLIED;
		const message = getMessageWithId(messageId);
		expect(message).toEqual('The password or email you entered was incorrect');
	});
});
