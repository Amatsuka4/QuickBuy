import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { AuthModal } from "./modal/AuthModal";
import UserMenuModal from "./modal/UserMenuModal";
import { SignOutButton } from "./HeaderButtonSignOut";
import type { User } from "firebase/auth";

interface AuthNavigationProps {
	user: User | null;
}

export function AuthNavigation({ user }: AuthNavigationProps) {
	const [isOpenModalId, setIsOpenModalId] = useState<string | null>(null);
	const { userProfile } = useAuthContext();

	if (user) {
		// ログイン時のナビゲーション
		return (
			<nav className="flex items-center space-x-4">
				<img
					src={userProfile?.iconUrl}
					alt="avatar"
					className="w-8 h-8 rounded-full cursor-pointer"
					onClick={() => setIsOpenModalId("usermenu")}
				/>
				<UserMenuModal isOpenModalId={isOpenModalId} setIsModalOpen={setIsOpenModalId} />
				<SignOutButton />
			</nav>
		);
	}

	// 未ログイン時のナビゲーション
	return (
		<nav className="space-x-4">
			<button
				onClick={() => setIsOpenModalId("signup")}
				className="cursor-pointer hover:text-gray-500 transition-colors bg-blue-500 text-white px-4 py-2 rounded-md"
			>
				SignUp
			</button>
			<AuthModal isOpenModalId={isOpenModalId} setIsModalOpen={setIsOpenModalId} mode="signup" />
			<button
				onClick={() => setIsOpenModalId("signin")}
				className="cursor-pointer hover:text-gray-500 transition-colors bg-blue-500 text-white px-4 py-2 rounded-md"
			>
				SignIn
			</button>
			<AuthModal isOpenModalId={isOpenModalId} setIsModalOpen={setIsOpenModalId} mode="signin" />
		</nav>
	);
}
