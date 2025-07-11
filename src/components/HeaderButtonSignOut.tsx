import { auth } from "../firebase";

export function SignOutButton() {
	const handleSignOut = () => {
		auth.signOut();
		window.location.reload();
	};

	return (
		<button className="cursor-pointer hover:text-gray-500 transition-colors" onClick={handleSignOut}>
			SignOut
		</button>
	);
}
