import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
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