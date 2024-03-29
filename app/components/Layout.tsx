import { UserButton } from '@clerk/remix';
import Logo from './Logo';
import { ThemeToggle } from './ThemeToggle';

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col min-h-screen min-w-full max-h-screen bg-background">
			<nav className="flex items-center justify-between border-b border-border h-[60px] px-4 py-2">
				<Logo />
				<div className="flex gap-2">
					<ThemeToggle />
					<UserButton afterSignOutUrl="/sign-in" />
				</div>
			</nav>
			<main className="flex w-full flex-grow">{children}</main>
		</div>
	);
}
