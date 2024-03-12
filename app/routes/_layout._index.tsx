import { getAuth } from '@clerk/remix/ssr.server';
import { LoaderFunction, json, redirect } from '@remix-run/node';
import { createClerkClient } from '@clerk/remix/api.server';
import { useLoaderData } from '@remix-run/react';

export const loader: LoaderFunction = async (args) => {
	const { userId } = await getAuth(args);

	if (!userId) {
		return redirect('/sign-in?redirect_url=' + args.request.url);
	}

	const user = await createClerkClient({
		secretKey: process.env.CLERK_SECRET_KEY,
	}).users.getUser(userId);

	return json({ user });
};

export default function HomeIndex() {
	const { user } = useLoaderData<typeof loader>();

	return (
		<div className="container pt-4">
			<p>Hello {user.firstName}</p>
		</div>
	);
}
