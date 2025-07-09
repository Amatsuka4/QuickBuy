import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SignUpModal, SignInModal } from "./modal/AuthModal";

const Header: React.FC = () => {
	const [isOpenModalId, setIsOpenModalId] = useState<string | null>(null);

	return (
		<header className="bg-white shadow-md">
			<div className="container mx-auto px-4 py-3 flex items-center justify-between">
				<div className="text-2xl font-bold text-gray-700 underline italic">
					<Link to="/">Codeal</Link>
				</div>
				<nav className="space-x-4">
					<button onClick={() => setIsOpenModalId("signup")}>SignUp</button>
					<SignUpModal isOpenModalId={isOpenModalId} setIsModalOpen={setIsOpenModalId} />
					<button onClick={() => setIsOpenModalId("signin")}>SignIn</button>
					<SignInModal isOpenModalId={isOpenModalId} setIsModalOpen={setIsOpenModalId} />
				</nav>
			</div>
		</header>
	);
};

export default Header;
