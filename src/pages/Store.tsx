import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserProfileByUsername } from "../services/userService";
import type { UserProfile } from "../types/user";
import Avatar from "../components/Avatar";
import { useAuthContext } from "../contexts/AuthContext";

export default function Store() {
	const { username } = useParams();
	const { userProfile: authUserProfile } = useAuthContext();
	const [externalUserProfile, setExternalUserProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(false);

	const isOwnStore = username === "@" + authUserProfile?.username;
	const displayProfile = isOwnStore ? authUserProfile : externalUserProfile;

	// 他人のショップの場合のみFirestoreから取得
	useEffect(() => {
		if (!username || isOwnStore) return;

		async function fetchAndSetProfile(username: string) {
			setLoading(true);
			const profile = await getUserProfileByUsername(username);
			setExternalUserProfile(profile);
			setLoading(false);
		}

		fetchAndSetProfile(username);
	}, [username, isOwnStore]);

	if (loading) {
		return <div className="flex flex-col items-center justify-center">読み込み中...</div>;
	}

	if (!displayProfile) {
		return <div className="flex flex-col items-center justify-center">ユーザーが見つかりません</div>;
	}

	return (
		<main className="flex flex-col items-center justify-center p-4">
			<div className="bg-gray-100 rounded-lg p-4">
				<Avatar src={displayProfile.iconUrl ?? ""} alt="icon" size={32} rounded={false} />
			</div>
		</main>
	);
}
