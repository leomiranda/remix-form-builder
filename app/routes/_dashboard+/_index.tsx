import { createClerkClient } from '@clerk/remix/api.server';
import { getAuth } from '@clerk/remix/ssr.server';
import { parseWithZod } from '@conform-to/zod';

import {
	ActionFunctionArgs,
	LoaderFunction,
	defer,
	json,
	redirect,
} from '@remix-run/node';
import { Dashboard } from '~/components/Dashboard/Dashboard';
import {
	createForm,
	getFormStats,
	getForms,
} from '~/modules/form/db/form.db.server';
import { createFormSchema } from '~/schemas/form';
import { invariantResponse } from '~/utils/error.server';

export const loader: LoaderFunction = async (args) => {
	const { userId } = await getAuth(args);

	if (!userId) {
		return redirect('/sign-in');
	}

	const user = await createClerkClient({
		secretKey: process.env.CLERK_SECRET_KEY,
	}).users.getUser(userId);

	invariantResponse(user, 'User not found');

	const stats = getFormStats(userId);

	invariantResponse(stats, 'Stats not found');

	const forms = await getForms(userId);

	return defer({
		user: {
			id: user.id,
			email: user.emailAddresses[0].emailAddress,
			firstName: user.firstName,
			lastName: user.lastName,
			imageUrl: user.imageUrl,
		},
		stats,
		forms,
	});
};

export default function Component() {
	return <Dashboard />;
}

export async function action(args: ActionFunctionArgs) {
	const { request } = args;
	const formData = await request.formData();
	const submission = parseWithZod(formData, {
		schema: createFormSchema,
	});

	if (submission.status !== 'success') {
		return json(
			{ result: submission.reply(), formId: null },
			{ status: submission.status === 'error' ? 400 : 200 }
		);
	}

	const { userId } = await getAuth(args);

	invariantResponse(userId, 'User not found');

	const { name, description } = submission.value;

	invariantResponse(typeof name === 'string', 'Form name is required');

	const form = await createForm({ userId, name, description });

	invariantResponse(form, 'Form not created');

	return json({ result: submission.reply(), formId: form.id });
}
