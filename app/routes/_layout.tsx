import { UserButton } from '@clerk/remix';
import { Outlet } from '@remix-run/react';
import Logo from '~/components/Logo';
import { ThemeToggle } from '~/components/ThemeToggle';

export default function Layout() {
	return (
		<div className="flex flex-col min-h-screen min-w-full max-h-screen bg-background">
			<nav className="flex items-center justify-between border-b border-border h-[60px] px-4 py-2">
				<Logo />
				<div className="flex gap-2">
					<ThemeToggle />
					<UserButton afterSignOutUrl="/sign-in" />
				</div>
			</nav>
			<main className="flex w-full flex-grow">
				<Outlet />
			</main>
		</div>
	);
}
