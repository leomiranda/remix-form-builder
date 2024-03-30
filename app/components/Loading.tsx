import { ImSpinner2 } from 'react-icons/im';

export function Loading() {
	return (
		<div className="flex items-center justify-center w-full">
			<ImSpinner2 className="animate-spin h-12 w-12" />
		</div>
	);
}
