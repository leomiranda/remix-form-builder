import {
	isRouteErrorResponse,
	useParams,
	useRouteError,
	type ErrorResponse,
} from '@remix-run/react';
import { getErrorMessage } from '~/utils/error.server';

type StatusHandler = (info: {
	error: ErrorResponse;
	params: Record<string, string | undefined>;
}) => JSX.Element | null;

export function GeneralErrorBoundary({
	defaultStatusHandler = ({ error }) => (
		<p>
			{error.status} {error.data}
		</p>
	),
	statusHandlers,
	unexpectedErrorHandler = (error) => <p>{getErrorMessage(error)}</p>,
}: {
	defaultStatusHandler?: StatusHandler;
	statusHandlers?: Record<number, StatusHandler>;
	unexpectedErrorHandler?: (error: unknown) => JSX.Element | null;
}) {
	const error = useRouteError();
	const params = useParams();

	if (typeof document !== 'undefined') {
		console.error(error);
	}

	return (
		<div className="container mx-auto flex h-full w-full items-center justify-center bg-destructive p-20 text-h2 text-destructive-foreground">
			{isRouteErrorResponse(error)
				? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
						error,
						params,
				  })
				: unexpectedErrorHandler(error)}
		</div>
	);
}
