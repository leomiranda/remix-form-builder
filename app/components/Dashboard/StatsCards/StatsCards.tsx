import { getFormStats } from '~/modules/form/db/form.db.server';
import { StatsCard } from './StatsCard';
import { LuView } from 'react-icons/lu';
import { HiCursorClick } from 'react-icons/hi';
import { TbArrowBounce } from 'react-icons/tb';
import { FaWpforms } from 'react-icons/fa';

interface StatsCardProps {
	data?: Awaited<ReturnType<typeof getFormStats>>;
	loading: boolean;
}
export function StatsCards({ data, loading }: StatsCardProps) {
	return (
		<div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
			<StatsCard
				title="Total visits"
				value={data?.visits.toLocaleString() ?? '0'}
				helperText="All time form visits"
				loading={loading}
				className="shadow-md shadow-gray-100 dark:shadow-black"
				icon={<LuView className="text-blue-600" />}
			/>
			<StatsCard
				title="Total submissions"
				value={data?.submissions.toLocaleString() ?? '0'}
				helperText="All time form submissions"
				loading={loading}
				className="shadow-md shadow-gray-100 dark:shadow-black"
				icon={<FaWpforms className="text-yellow-600" />}
			/>
			<StatsCard
				title="Submission rate"
				value={data?.submissionRate.toLocaleString() + '%' ?? '0'}
				helperText="Visits that resulted in a submission"
				loading={loading}
				className="shadow-md shadow-gray-100 dark:shadow-black"
				icon={<HiCursorClick className="text-green-600" />}
			/>
			<StatsCard
				title="Bounce rate"
				value={data?.bounceRate.toLocaleString() + '%' ?? '0'}
				helperText="Visits that left without submitting"
				loading={loading}
				className="shadow-md shadow-gray-100 dark:shadow-black"
				icon={<TbArrowBounce className="text-red-600" />}
			/>
		</div>
	);
}
