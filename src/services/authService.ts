import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, type AuthError } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

// Firebase認証エラーコードを日本語のユーザー向けメッセージに変換
function getErrorMessage(error: AuthError): string {
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
}

const createUserProfileFunction = httpsCallable(functions, 'createUserProfile');

export async function signUpService(email: string, password: string, name: string, id: string): Promise<{ success: boolean; error?: string }> {
    try {
        // 1. Firebase Authenticationでアカウント作成
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await userCredential.user.getIdToken(true);

        // 2. Cloud FunctionsでユーザープロフィールをFirestoreに保存
        const result = await createUserProfileFunction({
            userId: userCredential.user.uid,
            displayName: name,
            username: id,
        });

        if (result.data && (result.data as { success: boolean }).success) {
            console.log("ユーザープロフィールの作成に成功しました");
            console.log(result.data);
            return { success: true };
        } else {
            // プロフィール作成に失敗した場合、作成済みのFirebase Authアカウントを削除（ロールバック）
            await userCredential.user.delete();
            return { success: false, error: "ユーザープロフィールの作成に失敗しました。" };
        }

    } catch (error: any) {
        if (error instanceof FirebaseError) {
            // Firebase認証エラーの場合
            if (error.code && error.code.startsWith('auth/')) {
                return { success: false, error: getErrorMessage(error as AuthError) };
            }
            // Cloud Functionsエラーの場合
            if (error.code && error.message) {
                console.error("Cloud Functionエラー詳細:", error.message);
                switch (error.code) {
                    case "invalid-argument":
                        return { success: false, error: `入力内容に問題があります: ${error.message}` };
                    case "already-exists":
                        return { success: false, error: "このIDは既に使用されています。" };
                    case "permission-denied":
                        return { success: false, error: "権限がありません。" };
                    default:
                        return { success: false, error: `サーバーエラーが発生しました: ${error.message}` };
                }
            }
        }
        return { success: false, error: "予期しないエラーが発生しました。" };
    }
}

export async function signInService(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (error: any) {
        if (error instanceof FirebaseError) {
            return { success: false, error: getErrorMessage(error as AuthError) };
        }
        return { success: false, error: "予期しない認証エラーが発生しました" };
    }
}