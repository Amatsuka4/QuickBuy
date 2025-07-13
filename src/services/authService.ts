import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import type { AuthError } from "firebase/auth";

// エラーメッセージを日本語に変換する関数 //
const getErrorMessage = (error: AuthError): string => {
	switch (error.code) {
		case "auth/email-already-exists":
			return "このメールアドレスは既に使用されています。";
		case "auth/invalid-credential":
			return "メールアドレスかパスワードが間違っています。";
		case "auth/user-not-found":
			return "アカウントが存在しません。";
		case "auth/too-many-requests":
			return "リクエストが多すぎます。しばらく時間をおいてから再試行してください。";
		case "auth/invalid-email":
			return "無効なメールアドレスです。";
		case "auth/email-already-in-use":
			return "このメールアドレスは既に使用されています。";
		case "auth/invalid-password":
			return "パスワードが間違っています。";
		default:
			return `認証エラーが発生しました。エラーコード: ${error.code}`;
	}
};

// 新規登録サービス //
export async function signUpService(email: string, password: string, name: string, id: string): Promise<{ success: boolean; error?: string }> {
	try {
		// ID予約チェック //
		const usernameRef = doc(db, "usernames", id);
		const usernameSnap = await getDoc(usernameRef);
		if (usernameSnap.exists()) {
			return { success: false, error: "このIDは既に使用されています。" };
		}

		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const uid = userCredential.user.uid;

		await setDoc(doc(db, "users", uid), {
			displayName: name,
			username: id,
			createdAt: serverTimestamp(), // TODO: 後々、改ざん防止のため、サーバー側で制御するように変更
			iconUrl: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
		});

		await setDoc(usernameRef, { uid }, { merge: false });

		return { success: true };
	} catch (error) {
		if (error instanceof FirebaseError) {
			return { success: false, error: getErrorMessage(error as AuthError) };
		}
		return { success: false, error: "予期しない認証エラーが発生しました" };
	}
}

// ログインサービス //
export async function signInService(email: string, password: string): Promise<{ success: boolean; error?: string }> {
	try {
		await signInWithEmailAndPassword(auth, email, password);
		return { success: true };
	} catch (error) {
		if (error instanceof FirebaseError) {
			return { success: false, error: getErrorMessage(error as AuthError) };
		}
		return { success: false, error: "予期しない認証エラーが発生しました" };
	}
}