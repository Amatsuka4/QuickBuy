import { useAuthContext } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";

export default function Store() {
	const { userProfile } = useAuthContext();
	const { username } = useParams();

	return (
		<div className="flex flex-col items-center justify-center">
			<p className="text-4xl font-bold">{username}</p>
			<p className="text-4xl font-bold">
				{"@" + userProfile?.username === username ? "You are owner" : "You are not owner"}
			</p>
		</div>
	);
}
