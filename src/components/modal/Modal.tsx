import type { FC, ReactNode } from "react";
import ReactModal from "react-modal";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}

export const Modal: FC<Props> = ({ isOpen, onClose, children }) => {
	return (
		<ReactModal
			isOpen={isOpen}
			onRequestClose={onClose}
			contentLabel="Modal"
			closeTimeoutMS={100}
			ariaHideApp={false}
			className="relative z-[99] h-screen w-screen"
			overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-[99]"
		>
			<div className="flex size-full items-center justify-center" onClick={onClose}>
				<button
					className="absolute right-4 top-4 z-[999] p-2 text-gray-500 hover:text-gray-700 transition-colors"
					onClick={onClose}
					aria-label="モーダルを閉じる"
				>
					✕
				</button>
				{children}
			</div>
		</ReactModal>
	);
};
