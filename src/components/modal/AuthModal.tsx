import { useEffect, useState } from "react";
import { Modal } from "./BaseModal";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import type { ZxcvbnResult } from "@zxcvbn-ts/core/src/types";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnJaPackage from "@zxcvbn-ts/language-ja";
import { signUpService, signInService } from "../../services/authService";
import { validateUserForm, getPasswordWarning } from "../../utils/validationCheck";

// Zxcvbnの初期設定 //
zxcvbnOptions.setOptions({
	translations: zxcvbnJaPackage.translations,
	dictionary: {
		...zxcvbnCommonPackage.dictionary,
		...zxcvbnJaPackage.dictionary,
	},
});

// 強度バーのブロックの色を設定する関数 //
const getPasswordStrengthColor = (score: number): string => {
	const colors = {
		0: "bg-red-500",
		1: "bg-yellow-500",
		2: "bg-blue-500",
		3: "bg-green-400",
		4: "bg-green-600",
	};
	return colors[score as keyof typeof colors] || "bg-gray-300";
};

// パスワード強度バーのコンポーネント //
const PasswordStrengthBar = ({ zxcvbnResult }: { zxcvbnResult: ZxcvbnResult | null }) => {
	if (!zxcvbnResult) return null;

	return (
		<div className="mt-[20px]">
			<p className="text-sm text-gray-500 mb-2">パスワードの強度</p>
			<div className="flex w-full gap-[1%]">
				{[0, 1, 2, 3, 4].map((v) => (
					<div
						className={`h-[4px] w-[24%] ${
							v <= zxcvbnResult.score ? getPasswordStrengthColor(zxcvbnResult.score) : "bg-gray-300"
						}`}
						key={v}
					/>
				))}
			</div>
		</div>
	);
};

// 認証モーダルのコンポーネント //
export const AuthModal = ({
	isOpenModalId,
	setIsModalOpen,
	mode,
}: {
	isOpenModalId: string | null;
	setIsModalOpen: (isModalOpen: string | null) => void;
	mode: "signin" | "signup";
}) => {
	const [user, setUser] = useState({
		name: "",
		id: "",
		email: "",
		password: "",
	});
	const [zxcvbnResult, setZxcvbnResult] = useState<ZxcvbnResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			let result;
			switch (mode) {
				case "signup":
					result = await signUpService(user.email, user.password, user.name, user.id);
					break;
				case "signin":
					result = await signInService(user.email, user.password);
					break;
			}

			if (result.success) {
				setIsModalOpen(null);
			} else {
				setError(result.error || "認証に失敗しました");
			}
		} catch (err) {
			setError("予期しないエラーが発生しました");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (user.password.length < 8) {
			setZxcvbnResult(null);
			return;
		}

		setZxcvbnResult(zxcvbn(user.password));
	}, [user.password]);

	// フォームが変更されたときにエラーをクリア
	useEffect(() => {
		setError(null);
	}, [user.email, user.password, user.name, user.id]);

	const isSignUp = mode === "signup";
	const title = isSignUp ? "新規登録" : "ログイン";
	const buttonText = isSignUp ? "登録" : "ログイン";

	// バリデーションエラーを取得
	const currentValidationErrors = validateUserForm(user, isSignUp);

	// ボタンの無効化条件 //
	const isButtonDisabled =
		!user.email ||
		user.password.length < 8 ||
		(isSignUp && zxcvbnResult !== null && zxcvbnResult.score < 2) ||
		currentValidationErrors.length > 0 ||
		isLoading;

	return (
		<Modal isOpen={isOpenModalId === mode} onClose={() => setIsModalOpen(null)}>
			<div className="relative bg-white rounded-lg p-8 w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
				<button
					className="absolute top-2 right-4 z-[999] p-1 text-black hover:text-gray-700 transition-colors cursor-pointer"
					onClick={() => setIsModalOpen(null)}
				>
					X
				</button>
				<h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">{title}</h1>

				<form className="space-y-4" onSubmit={handleSubmit}>
					{isSignUp && (
						<>
							<input
								type="text"
								placeholder="Nickname"
								className="w-full p-2 border border-gray-300 rounded-md"
								value={user.name}
								onChange={(e) => setUser({ ...user, name: e.target.value })}
								aria-label="Nickname"
								minLength={2}
								maxLength={10}
								required
								disabled={isLoading}
							/>
							<input
								type="text"
								placeholder="ID"
								className="w-full p-2 border border-gray-300 rounded-md"
								value={user.id}
								onChange={(e) => setUser({ ...user, id: e.target.value })}
								aria-label="ID"
								minLength={5}
								maxLength={16}
								pattern="^[a-zA-Z0-9]+$"
								required
								disabled={isLoading}
							/>
						</>
					)}

					<input
						type="email"
						placeholder="Email"
						className="w-full p-2 border border-gray-300 rounded-md"
						value={user.email}
						onChange={(e) => setUser({ ...user, email: e.target.value })}
						aria-label="Email"
						required
						disabled={isLoading}
					/>
					<input
						type="password"
						placeholder="Password"
						className="w-full p-2 border border-gray-300 rounded-md"
						value={user.password}
						onChange={(e) => setUser({ ...user, password: e.target.value })}
						maxLength={32}
						aria-label="Password"
						required
						disabled={isLoading}
					/>

					{/* パスワード強度チェックは登録時のみ表示 */}
					{isSignUp && <PasswordStrengthBar zxcvbnResult={zxcvbnResult} />}

					{/* バリデーションエラー */}
					{currentValidationErrors.map((validationError, index) => (
						<div key={index} className="text-[#f00] text-sm">
							{validationError.message}
						</div>
					))}

					{/* パスワード強度の警告 */}
					{isSignUp && getPasswordWarning(zxcvbnResult) && (
						<div className="text-[#f00] text-sm">{getPasswordWarning(zxcvbnResult)}</div>
					)}

					{/* 認証エラーの表示 */}
					{error && <div className="text-[#f00]">{error}</div>}

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isButtonDisabled}
					>
						{isLoading ? "処理中..." : buttonText}
					</button>
				</form>

				<div className="mt-[20px] flex justify-end">
					<button
						onClick={() => setIsModalOpen(mode === "signup" ? "signin" : "signup")}
						className={`text-sm text-blue-600 text-gray-500 hover:text-blue-700 transition-colors ${
							isLoading ? "cursor-not-allowed" : "cursor-pointer"
						}`}
						disabled={isLoading}
					>
						{mode === "signup" ? "アカウントをお持ちですか？" : "アカウントを作成しますか？"}
					</button>
				</div>
			</div>
		</Modal>
	);
};
