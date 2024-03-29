import { getFormStats } from '~/modules/form/db/form.db.server';
import { Suspense } from 'react';
import { Await } from '@remix-run/react';
import { Separator } from '~/components/ui/separator';
import { CreateFormButton } from '~/components/CreateFormButton';
import { Prisma } from '@prisma/client';
import { StatsCards } from './StatsCards/StatsCards';

interface DashboardProps {
	stats: Prisma.PromiseReturnType<typeof getFormStats>;
}

export function Dashboard({ stats }: DashboardProps) {
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
