import { getAuth } from '@clerk/remix/ssr.server';
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { GeneralErrorBoundary } from '~/components/ErrorBoundary';
import { FormBuilder } from '~/components/FormBuilder/FormBuilder';
import { GetFormById } from '~/modules/form/db/form.db.server';
import { invariantResponse } from '~/utils/error.server';

export async function loader(args: LoaderFunctionArgs) {
	const { userId } = await getAuth(args);

	if (!userId) {
		return redirect('/sign-in');
	}

	const { formId } = args.params;
	const form = await GetFormById(userId, Number(formId));

	invariantResponse(form, 'Form not found');

	return json({
		form,
	});
}

export default function Component() {
	return <FormBuilder />;
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No form with the id &quot;{params.noteId}&quot; exists</p>
				),
			}}
		/>
	);
}
