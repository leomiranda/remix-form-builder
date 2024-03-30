import { CreateFormSchemaType } from '~/schemas/form';
import { db } from '~/utils/db.server';

export async function getFormStats(userId: string) {
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

export async function createForm(
	data: CreateFormSchemaType & { userId: string }
) {
	const { userId, name, description } = data;

	return await db.form.create({
		data: {
			userId,
			name,
			description,
		},
	});
}

export async function getForms(userId: string) {
	setTimeout(() => {
		console.log('Delayed for 1 second.');
	}, 1000);

	return await db.form.findMany({
		where: {
			userId,
		},
	});
}

export async function GetFormById(userId: string, id: number) {
	return await db.form.findUnique({
		where: {
			userId: userId,
			id,
		},
	});
}
