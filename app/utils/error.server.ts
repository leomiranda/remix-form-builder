/**
 * Provide a condition and if that condition is falsey, this throws a 400
 * Response with the given message.
 *
 * @example
 * invariantResponse(typeof value === 'string', `value must be a string`)
 *
 * @param condition The condition to check
 * @param message The message to throw
 * @param responseInit Additional response init options if a response is thrown
 *
 * @throws {Response} if condition is falsey
 */
export function invariantResponse(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	condition: any,
	message?: string | (() => string),
	responseInit?: ResponseInit
): asserts condition {
	if (!condition) {
		throw new Response(
			typeof message === 'function' ? message() : message || 'Error',
			{
				status: 400,
				...responseInit,
			}
		);
	}
}

/**
 * Does its best to get a string error message from an unknown error.
 */
export function getErrorMessage(error: unknown) {
	if (typeof error === 'string') return error;
	if (
		error &&
		typeof error === 'object' &&
		'message' in error &&
		typeof error.message === 'string'
	) {
		return error.message;
	}
	console.error('Unable to get error message for error', error);
	return 'Unknown Error';
}
