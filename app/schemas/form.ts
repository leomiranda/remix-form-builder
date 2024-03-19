import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

export const createFormSchema = z.object({
	name: z.string().min(4),
	description: z.string().optional(),
});
export type createFormSchemaType = z.infer<typeof createFormSchema>;
export const resolverCreateForm = zodResolver(createFormSchema);
