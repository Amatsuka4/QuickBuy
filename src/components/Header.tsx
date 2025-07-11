import { useAuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { AuthNavigation } from "./HeaderAuthNav";

export default function Header() {
	const { user, isLoading } = useAuthContext();

	return (
		<header className="bg-white shadow-md">
			<div className="container mx-auto px-4 py-3 flex items-center justify-between">
				<div className="text-2xl font-bold text-gray-700 underline italic">
					<Link to="/">Codeal</Link>
				</div>
				{isLoading ? null : <AuthNavigation user={user} />}
			</div>
		</header>
	);
}
