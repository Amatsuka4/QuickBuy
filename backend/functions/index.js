const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const validateUserFormData = (user, isSignUp) => {
	const errors = [];

	if (!user.name || user.name.length < 2) {
		errors.push({
			field: "name",
			message: "ニックネームは2文字以上で入力してください",
		});
	}

	if (!user.id) {
		errors.push({
			field: "id",
			message: "IDは必須です",
		});
	} else {
		if (user.id.length < 3) {
			errors.push({
				field: "id",
				message: "IDは3文字以上で入力してください",
			});
		}

		if (!/^[a-zA-Z0-9]+$/.test(user.id)) {
			errors.push({
				field: "id",
				message: "IDは半角英数字のみ使用できます",
			});
		}

		if (/^[0-9]/.test(user.id)) {
			errors.push({
				field: "id",
				message: "IDの先頭に数字は使用できません",
			});
		}
	}

	return errors;
};

exports.createUserProfile = functions.https.onCall(async (data, context) => {
	// onCall関数は自動でFirebase Authenticationの認証情報を含むため、これを利用
	if (!context.auth) {
		throw new functions.https.HttpsError("unauthenticated", "この操作には認証が必要です。");
	}

	const { userId, name, id } = data;

	// 渡された userId が現在認証されているユーザーの ID と一致するか確認
	if (context.auth.uid !== userId) {
		throw new functions.https.HttpsError("permission-denied", "認証ユーザーのIDとリクエストされたIDが一致しません。");
	}

	const validationErrors = validateUserFormData({ name, id }, true);

	if (validationErrors.length > 0) {
		throw new functions.https.HttpsError("invalid-argument", "入力データが無効です。", validationErrors);
	}

	const userDocRef = db.collection("users").doc(id);

	try {
		const existingDoc = await userDocRef.get();
		if (existingDoc.exists) {
			throw new functions.https.HttpsError(
				"already-exists",
				"指定されたIDは既に使用されています。別のIDを選択してください。"
			);
		}

		await userDocRef.set({
			firebaseAuthUid: userId,
			name: name,
			createdAt: admin.firestore.FieldValue.serverTimestamp(),
			points: 0,
		});

		return { success: true, message: `ユーザー ${id} のプロフィールが作成されました。` };
	} catch (error) {
		console.error("ユーザープロフィール作成エラー:", error);
		if (error instanceof functions.https.HttpsError) {
			throw error;
		}
		throw new functions.https.HttpsError("internal", "ユーザープロフィールの作成中に予期せぬエラーが発生しました。");
	}
});
