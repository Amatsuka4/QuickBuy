import { Modal } from "./BaseModal";

export default function UserMenuModal({
	isOpenModalId,
	setIsModalOpen,
}: {
	isOpenModalId: string | null;
	setIsModalOpen: (isModalOpen: string | null) => void;
}) {
	return (
		<Modal isOpen={isOpenModalId === "usermenu"} onClose={() => setIsModalOpen(null)}>
			<div className="bg-white p-4 rounded-md">
				<h2 className="text-2xl font-bold">User Menu</h2>
			</div>
		</Modal>
	);
}
