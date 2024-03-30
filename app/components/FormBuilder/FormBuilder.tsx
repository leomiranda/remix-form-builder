import { useLoaderData } from '@remix-run/react';
import { loader as formIdLoader } from '~/routes/_dashboard+/builder+/$formId';

export function FormBuilder() {
	const data = useLoaderData<typeof formIdLoader>();
	return (
		<div className="flex items-center justify-center w-full">
			Form Builder: {data?.form?.name}
		</div>
	);
}
