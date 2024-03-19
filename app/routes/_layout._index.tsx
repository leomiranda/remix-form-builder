import { createClerkClient } from '@clerk/remix/api.server';
import { getAuth } from '@clerk/remix/ssr.server';
import {
	ArrowDownIcon,
	ArrowUpIcon,
	EnvelopeClosedIcon,
	PersonIcon,
} from '@radix-ui/react-icons';
import {
	ActionFunctionArgs,
	LoaderFunction,
	defer,
	json,
	redirect,
} from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { getValidatedFormData } from 'remix-hook-form';
import { CreateFormButton } from '~/components/CreateFormButton';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';
import { createForm, getFormStats } from '~/modules/form/db/form.db.server';
import { createFormSchemaType, resolverCreateForm } from '~/schemas/form';
import { invariantResponse } from '~/utils/error.server';

export const loader: LoaderFunction = async (args) => {
	const { userId } = await getAuth(args);

	invariantResponse(userId, 'User not found');

	const user = await createClerkClient({
		secretKey: process.env.CLERK_SECRET_KEY,
	}).users.getUser(userId);

	invariantResponse(user, 'User not found');

	const stats = getFormStats(userId);

	invariantResponse(stats, 'Stats not found');

	return defer({
		user: {
			id: user.id,
			email: user.emailAddresses[0].emailAddress,
			firstName: user.firstName,
			lastName: user.lastName,
			imageUrl: user.imageUrl,
		},
		stats,
	});
};

export default function HomeIndex() {
	const { stats } = useLoaderData<typeof loader>();

	return (
		<div className="container pt-4">
			<Suspense fallback={<StatsCards loading={true} />}>
				<Await resolve={stats}>
					{(resolvedStats) => (
						<StatsCards data={resolvedStats} loading={false} />
					)}
				</Await>
			</Suspense>
			<Separator className="my-6" />
			<h2 className="text-4xl font-bold col-span-2">Your Forms</h2>
			<Separator className="my-6" />
			<CreateFormButton />
		</div>
	);
}
interface StatsCardProps {
	data?: Awaited<ReturnType<typeof getFormStats>>;
	loading: boolean;
}
function StatsCards({ data, loading }: StatsCardProps) {
	return (
		<div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
			<StatsCard
				title="Total visits"
				value={data?.visits.toLocaleString() ?? '0'}
				helperText="All time form visits"
				loading={loading}
				className="shadow-md shadow-gray-100 dark:shadow-black"
				icon={<PersonIcon />}
			/>
			<StatsCard
				title="Total submissions"
				value={data?.submissions.toLocaleString() ?? '0'}
				helperText="All time form submissions"
				loading={loading}
				className="shadow-md shadow-gray-100 dark:shadow-black"
				icon={<EnvelopeClosedIcon />}
			/>
			<StatsCard
				title="Submission rate"
				value={data?.submissionRate.toLocaleString() + '%' ?? '0'}
				helperText="Visits that resulted in a submission"
				loading={loading}
				className="shadow-md shadow-gray-100 dark:shadow-black"
				icon={<ArrowUpIcon />}
			/>
			<StatsCard
				title="Bounce rate"
				value={data?.bounceRate.toLocaleString() + '%' ?? '0'}
				helperText="Visits that left without submitting"
				loading={loading}
				className="shadow-md shadow-gray-100 dark:shadow-black"
				icon={<ArrowDownIcon />}
			/>
		</div>
	);
}

interface StatsCardProps {
	title?: string;
	value?: string;
	loading: boolean;
	helperText?: string;
	className?: string;
	icon?: React.ReactNode;
}
function StatsCard({
	title,
	value,
	loading,
	helperText,
	className,
	icon,
}: StatsCardProps) {
	return (
		<Card className={className}>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">
					{loading && (
						<Skeleton>
							<span className="opacity-0">0</span>
						</Skeleton>
					)}
					{!loading && value}
				</div>
				<p className="text-xs text-muted-foreground pt-1">{helperText}</p>
			</CardContent>
		</Card>
	);
}

export const action = async (args: ActionFunctionArgs) => {
	const { request } = args;
	const {
		errors,
		data,
		receivedValues: defaultValues,
	} = await getValidatedFormData<createFormSchemaType>(
		request,
		resolverCreateForm
	);

	if (errors) {
		return json({ errors, defaultValues, success: false });
	}

	const { userId } = await getAuth(args);

	invariantResponse(userId, 'User not found');

	const { name, description } = data;

	invariantResponse(typeof name === 'string', 'Form name is required');

	const form = await createForm({ userId, name, description });
	console.log('🚀 ~ action ~ form:', form);

	invariantResponse(form, 'Form not created');

	return json({ success: true });
};
