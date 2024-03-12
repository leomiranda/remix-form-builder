import { db } from '~/utils/db.server';

export async function getFormStats(userId) {
	const stats = await db.form.aggregate({
		where: {
			userId,
		},
		_sum: {
			visits: true,
			submissions: true,
		},
	});

	const visits = stats._sum.visits || 0;

	const submissions = stats._sum.submissions || 0;

	let submissionRate = 0;

	if (visits > 0) {
		submissionRate = (submissions / visits) * 100;
	}

	const bounceRate = 100 - submissionRate;

	return {
		visits,
		submissions,
		submissionRate,
		bounceRate,
	};
}
