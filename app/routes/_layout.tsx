import { UserButton } from '@clerk/remix';
import { Outlet } from '@remix-run/react';

export default function Layout() {
	return (
		<div className="flex flex-col min-h-screen min-w-full max-h-screen bg-background">
			<nav>
				<UserButton afterSignOutUrl="/sign-in" />
			</nav>
			<main className="flex w-full flex-grow">
				<Outlet />
			</main>
		</div>
	);
}
