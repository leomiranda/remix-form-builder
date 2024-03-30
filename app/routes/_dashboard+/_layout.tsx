import { Outlet } from '@remix-run/react';
import { Layout } from '~/components/Layout';

export default function Component() {
	return (
		<Layout>
			<Outlet />
		</Layout>
	);
}
