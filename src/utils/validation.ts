// バリデーションエラーの型定義
export interface ValidationError {
	field: string;
	message: string;
}

// ユーザー情報の型定義
export interface UserFormData {
	name: string;
	id: string;
	email: string;
	password: string;
}

// バリデーション関数
export const validateUserForm = (user: UserFormData, isSignUp: boolean): ValidationError[] => {
	const errors: ValidationError[] = [];

	// 新規登録時のみのバリデーション
	if (isSignUp) {
		// ニックネームのバリデーション
		if (user.name.length > 0 && user.name.length < 2) {
			errors.push({
				field: 'name',
				message: 'ニックネームは2文字以上で入力してください'
			});
		}

		// IDのバリデーション
		if (user.id.length > 0) {
			if (user.id.length < 5) {
				errors.push({
					field: 'id',
					message: 'IDは5文字以上で入力してください'
				});
			}

			if (!/^[a-zA-Z0-9]+$/.test(user.id)) {
				errors.push({
					field: 'id',
					message: 'IDは半角英数字のみ使用できます'
				});
			}

			if (/^[0-9]+$/.test(user.id[0])) {
				errors.push({
					field: 'id',
					message: 'IDの先頭に数字は使用できません'
				});
			}
		}
	}

	return errors;
};

// パスワード強度の警告メッセージを取得する関数
export const getPasswordWarning = (zxcvbnResult: any): string | null => {
	return zxcvbnResult?.feedback?.warning || null;
};