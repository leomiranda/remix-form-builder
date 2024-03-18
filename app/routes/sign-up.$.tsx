import { SignUp } from '@clerk/remix';

export default function SignUpPage() {
	return (
		<div className="flex w-full h-screen items-center justify-center">
			<h1>Sign Up route</h1>
			<SignUp />
		</div>
	);
}
