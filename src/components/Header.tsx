import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
	return (
		<header className="bg-white shadow-md">
			<div className="container mx-auto px-4 py-3 flex items-center justify-between">
				<div className="text-2xl font-bold text-blue-600">
					<Link to="/">MyLogo</Link>
				</div>
				<nav className="space-x-4">
					<Link
						to="/signin"
						className="text-gray-700 hover:text-blue-600 transition-colors"
					>
						Signin
					</Link>
					<Link
						to="/login"
						className="text-gray-700 hover:text-blue-600 transition-colors"
					>
						Login
					</Link>
				</nav>
			</div>
		</header>
	);
};

export default Header;
