import { Suspense } from 'react';
import { Await, useLoaderData } from '@remix-run/react';
import { Separator } from '~/components/ui/separator';
import { CreateFormButton } from '~/components/FormBuilder/CreateFormButton';
import { StatsCards } from './StatsCards/StatsCards';
import { loader as loaderDashboardIndex } from '~/routes/_dashboard._index';
import { FormCardSkeleton } from '../FormBuilder/FormCardSkeleton';
import { FormCard } from '../FormBuilder/FormCard';
import { Form } from '@prisma/client';

export function Dashboard() {
	const { stats, forms } = useLoaderData<typeof loaderDashboardIndex>();
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
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<CreateFormButton />

				<Suspense
					fallback={[1, 2, 3].map((el) => (
						<FormCardSkeleton key={el} />
					))}
				>
					<Await resolve={forms}>
						{(resolvedForms) =>
							resolvedForms.map((form: Form) => (
								<FormCard key={form.id} form={form} />
							))
						}
					</Await>
				</Suspense>
			</div>
		</div>
	);
}
