import { Link } from '@remix-run/react';

export default function Logo() {
	return (
		<Link to="/" className="uppercase tracking-tighter">
			<span className="text-gray-500">Form</span>
			<span className="font-semibold text-gray-700 dark:text-gray-200">
				Builder
			</span>
		</Link>
	);
}
