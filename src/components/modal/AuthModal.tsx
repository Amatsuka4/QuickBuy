import { Modal } from "./Modal";

// 登録用モーダル //
export const SignUpModal = ({
	isOpenModalId,
	setIsModalOpen,
}: {
	isOpenModalId: string | null;
	setIsModalOpen: (isModalOpen: string | null) => void;
}) => {
	return (
		<Modal isOpen={isOpenModalId === "signup"} onClose={() => setIsModalOpen(null)}>
			<div>
				<h1>SignUp</h1>
			</div>
		</Modal>
	);
};

// ログイン用モーダル //
export const SignInModal = ({
	isOpenModalId,
	setIsModalOpen,
}: {
	isOpenModalId: string | null;
	setIsModalOpen: (isModalOpen: string | null) => void;
}) => {
	return (
		<Modal isOpen={isOpenModalId === "signin"} onClose={() => setIsModalOpen(null)}>
			<div>
				<h1>SignIn</h1>
			</div>
		</Modal>
	);
};
