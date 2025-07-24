const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const DEFAULT_USER_TOKEN = 100;

// 定数定義
const VALIDATION_CONSTANTS = {
    MIN_DISPLAY_NAME_LENGTH: 2,
    MIN_USERNAME_LENGTH: 3,
    USERNAME_REGEX: /^[a-zA-Z0-9]+$/,
    NUMBER_START_REGEX: /^[0-9]/,
};

const ERROR_MESSAGES = {
    DISPLAY_NAME_TOO_SHORT: "ニックネームは2文字以上で入力してください",
    USERNAME_REQUIRED: "IDは必須です",
    USERNAME_TOO_SHORT: "IDは3文字以上で入力してください",
    USERNAME_INVALID_CHARS: "IDは半角英数字のみ使用できます",
    USERNAME_STARTS_WITH_NUMBER: "IDの先頭に数字は使用できません",
    UNAUTHENTICATED: "この操作には認証が必要です。",
    PERMISSION_DENIED: "認証ユーザーのIDとリクエストされたIDが一致しません。",
    INVALID_INPUT: "入力データが無効です。",
    USERNAME_EXISTS:
        "指定されたIDは既に使用されています。別のIDを選択してください。",
    INTERNAL_ERROR:
        "ユーザープロフィールの作成中に予期せぬエラーが発生しました。",
};

const DEFAULT_USER_DATA = {
    bio: "",
    iconUrl:
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    token: DEFAULT_USER_TOKEN,
};

// ユーザーフォームデータのバリデーション
const validateUserFormData = (userData) => {
    const errors = [];
    const { displayName, username } = userData;

    // 表示名のバリデーション
    if (
        !displayName ||
        displayName.trim().length < VALIDATION_CONSTANTS.MIN_DISPLAY_NAME_LENGTH
    ) {
        errors.push({
            field: "displayName",
            message: ERROR_MESSAGES.DISPLAY_NAME_TOO_SHORT,
        });
    }

    // ユーザーIDのバリデーション
    if (!username || !username.trim()) {
        errors.push({
            field: "username",
            message: ERROR_MESSAGES.USERNAME_REQUIRED,
        });
    } else {
        const trimmedUsername = username.trim();

        // 長さチェック
        if (trimmedUsername.length < VALIDATION_CONSTANTS.MIN_USERNAME_LENGTH) {
            errors.push({
                field: "username",
                message: ERROR_MESSAGES.USERNAME_TOO_SHORT,
            });
        }

        // 文字種チェック
        if (!VALIDATION_CONSTANTS.USERNAME_REGEX.test(trimmedUsername)) {
            errors.push({
                field: "username",
                message: ERROR_MESSAGES.USERNAME_INVALID_CHARS,
            });
        }

        // 先頭数字チェック
        if (VALIDATION_CONSTANTS.NUMBER_START_REGEX.test(trimmedUsername)) {
            errors.push({
                field: "username",
                message: ERROR_MESSAGES.USERNAME_STARTS_WITH_NUMBER,
            });
        }
    }

    return errors;
};

// 認証ユーザーの検証
const validateAuthenticatedUser = (request, userId) => {
    if (!request.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            ERROR_MESSAGES.UNAUTHENTICATED
        );
    }

    if (request.auth.uid !== userId) {
        throw new functions.https.HttpsError(
            "permission-denied",
            ERROR_MESSAGES.PERMISSION_DENIED
        );
    }
};

// ユーザードキュメントの作成
const createUserDocumentData = (username, displayName) => {
    return {
        displayName: displayName.trim(),
        username: username.trim(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        ...DEFAULT_USER_DATA,
    };
};

/**
 * ユーザープロフィール作成のFirebase Cloud Function
 * @param {Object} request - リクエストデータ
 * @returns {Object} 成功メッセージまたはエラー
 */
exports.createUserProfile = functions.https.onCall(async (request) => {
    const { userId, displayName, username } = request.data;

    try {
        // 認証チェック
        validateAuthenticatedUser(request, userId);

        // 入力データのバリデーション
        const validationErrors = validateUserFormData(
            { displayName, username },
            true
        );

        if (validationErrors.length > 0) {
            throw new functions.https.HttpsError(
                "invalid-argument",
                ERROR_MESSAGES.INVALID_INPUT,
                validationErrors
            );
        }

        const trimmedUsername = username.trim();
        const userDocRef = db.collection("users").doc(trimmedUsername);

        // トランザクションを使用してアトミックな操作を保証
        const result = await db.runTransaction(async (transaction) => {
            const existingDoc = await transaction.get(userDocRef);

            if (existingDoc.exists) {
                throw new functions.https.HttpsError(
                    "already-exists",
                    ERROR_MESSAGES.USERNAME_EXISTS
                );
            }

            const userData = createUserDocumentData(
                trimmedUsername,
                displayName
            );
            transaction.set(userDocRef, userData);

            // UID → username の逆引き用コレクション作成
            const usernameRef = db.collection("usernames").doc(userId);
            transaction.set(usernameRef, {
                id: trimmedUsername,
            });

            // ユーザーのproductsサブコレクション作成
            const productsRef = userDocRef
                .collection("products")
                .doc("_placeholder");
            transaction.set(productsRef, {
                _placeholder: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            // transactionsサブコレクション作成
            const transactionsRef = userDocRef
                .collection("transactions")
                .doc("_placeholder");
            transaction.set(transactionsRef, {
                transactions: [],
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            return {
                success: true,
                message: `ユーザー ${trimmedUsername} のプロフィールが作成されました。`,
            };
        });

        return result;
    } catch (error) {
        console.error("ユーザープロフィール作成エラー:", error);

        // HttpsErrorはそのまま再スロー
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }

        // 予期しないエラーは内部エラーとして処理
        throw new functions.https.HttpsError(
            "internal",
            ERROR_MESSAGES.INTERNAL_ERROR
        );
    }
});

// ------------------------------------------------------------
