import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { UserProfile } from "../types/user";

// ユーザープロファイルを取得する関数 //
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
	try {
		const userRef = doc(db, "users", uid);
		const userSnap = await getDoc(userRef);

		if (userSnap.exists()) {
			return userSnap.data() as UserProfile;
		}

		return null; // 存在しなければnullを返す //
	} catch (error) {
		console.error("ユーザープロファイルの取得に失敗しました:", error);
		return null;
	}
}

export async function getUserProfileByUsername(username: string): Promise<UserProfile | null> {
	try {
		if (username.startsWith("@")) {
			username = username.slice(1);
		}

		const userRef = doc(db, "usernames", username);
		const userSnap = await getDoc(userRef);

		if (userSnap.exists()) {
			const uid = userSnap.data().uid;
			return await getUserProfile(uid);
		}

		return null;
	} catch (error) {
		console.error("ユーザープロファイルの取得に失敗しました:", error);
		return null;
	}
}