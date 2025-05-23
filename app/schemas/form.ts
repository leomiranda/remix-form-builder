import * as z from 'zod';

export const createFormSchema = z.object({
	name: z.string().min(4).max(100),
	description: z.string().max(1000).optional(),
});

export type CreateFormSchemaType = z.infer<typeof createFormSchema>;
