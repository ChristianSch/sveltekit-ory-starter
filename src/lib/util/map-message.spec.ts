import { AuthMessage, getCustomMessage } from './map-message';

describe('getCustomMessage', () => {
	test('should interpolate values correctly', () => {
		const messageId = AuthMessage.BAD_LENGTH_SUPPLIED;
		const interpolators = {
			field: 'email',
			requiredLength: 5
		};
		const message = getCustomMessage(messageId, interpolators);
		expect(message).toEqual(
			`${interpolators.field} should be at least ${interpolators.requiredLength} characters`
		);
	});

	test('should return correct message if it does not need interpolation', () => {
		const messageId = AuthMessage.INVALID_CREDENTIALS_SUPPLIED;
		const message = getCustomMessage(messageId);
		expect(message).toEqual('The password or email you entered was incorrect');
	});
});
