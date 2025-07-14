import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { UserProfile } from "../types/user";

// ユーザープロファイルを取得する関数 //
export async function getUserProfile(username: string): Promise<UserProfile | null> {
	try {

		const userRef = doc(db, "users", username);
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

export async function getUsernameByUid(uid: string): Promise<string | null> {
	try {
		const userRef = doc(db, "usernames", uid);
		const userSnap = await getDoc(userRef);
		return userSnap.data()?.id || null;
	} catch (error) {
		console.error("ユーザーIDの取得に失敗しました:", error);
		return null;
	}
}

export async function getUserProfileByUsername(username: string): Promise<UserProfile | null> {
	return await getUserProfile(username);
}