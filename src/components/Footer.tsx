import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer className="border-t border-gray-200 py-4">
			<nav className="flex w-1/4 mx-auto justify-between mb-4">
				<Link to="/about" className="text-sm">
					About
				</Link>
				<a href="https://github.com/Amatsuka4/codeal" target="_blank" className="text-sm">
					GitHub
				</a>
				<a href="https://x.com/29719" target="_blank" className="text-sm">
					X(Twitter)
				</a>
			</nav>
			<div className="container mx-auto px-4">
				<p className="text-center text-xs">© 2025 Codeal. All rights reserved.</p>
			</div>
		</footer>
	);
}
