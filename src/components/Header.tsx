import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthModal } from "./modal/AuthModal";
import { useAuthContext } from "../contexts/AuthContext";
import { auth } from "../firebase";

export default function Header() {
	const [isOpenModalId, setIsOpenModalId] = useState<string | null>(null);
	const { user, userProfile, isLoading } = useAuthContext();

	return (
		<header className="bg-white shadow-md">
			<div className="container mx-auto px-4 py-3 flex items-center justify-between">
				<div className="text-2xl font-bold text-gray-700 underline italic">
					<Link to="/">Codeal</Link>
				</div>
				{isLoading ? null : user ? (
					<nav className="flex items-center space-x-4">
						<div className="text-gray-700">
							<h1 className="font-bold">{userProfile?.displayName}</h1>
							{userProfile?.userId && <p className="text-sm text-gray-500">@{userProfile.userId}</p>}
						</div>
						<button
							className="cursor-pointer hover:text-gray-500 transition-colors"
							onClick={() => {
								auth.signOut();
								window.location.reload();
							}}
						>
							SignOut
						</button>
					</nav>
				) : (
					<nav className="space-x-4">
						<button
							onClick={() => setIsOpenModalId("signup")}
							className="cursor-pointer hover:text-gray-500 transition-colors"
						>
							SignUp
						</button>
						<AuthModal isOpenModalId={isOpenModalId} setIsModalOpen={setIsOpenModalId} mode="signup" />
						<button
							onClick={() => setIsOpenModalId("signin")}
							className="cursor-pointer hover:text-gray-500 transition-colors"
						>
							SignIn
						</button>
						<AuthModal isOpenModalId={isOpenModalId} setIsModalOpen={setIsOpenModalId} mode="signin" />
					</nav>
				)}
			</div>
		</header>
	);
}
