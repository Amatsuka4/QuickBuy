import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { AuthModal } from "./modal/AuthModal";
import UserMenuDropdown from "./HeaderUserMenuDropdown";
import type { User } from "firebase/auth";
import DebugModal from "./modal/DebugModal";

interface AuthNavigationProps {
	user: User | null;
}

export function AuthNavigation({ user }: AuthNavigationProps) {
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const [isOpenModalId, setIsOpenModalId] = useState<string | null>(null);
	const { userProfile } = useAuthContext();

	if (user) {
		// ログイン時のナビゲーション
		return (
			<nav className="flex items-center space-x-4">
				{/* Debugモーダル デプロイ時に削除*/}
				<button onClick={() => setIsOpenModalId("debug")}>Debug</button>
				<DebugModal isOpenModalId={isOpenModalId} setIsModalOpen={setIsOpenModalId} />
				<div className="relative">
					<img
						src={userProfile?.iconUrl}
						alt="avatar"
						className="w-8 h-8 rounded-full cursor-pointer"
						onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
					/>
					<UserMenuDropdown isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
				</div>
			</nav>
		);
	}

	// 未ログイン時のナビゲーション
	return (
		<nav className="space-x-4">
			{/* Debugモーダル デプロイ時に削除*/}
			<button onClick={() => setIsOpenModalId("debug")}>Debug</button>
			<DebugModal isOpenModalId={isOpenModalId} setIsModalOpen={setIsOpenModalId} />

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
