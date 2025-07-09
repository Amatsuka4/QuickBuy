import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthModal } from "./modal/AuthModal";

const Header: React.FC = () => {
	const [isOpenModalId, setIsOpenModalId] = useState<string | null>(null); // Default: null but if development, set to "signin"

	return (
		<header className="bg-white shadow-md">
			<div className="container mx-auto px-4 py-3 flex items-center justify-between">
				<div className="text-2xl font-bold text-gray-700 underline italic">
					<Link to="/">Codeal</Link>
				</div>
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
			</div>
		</header>
	);
};

export default Header;
