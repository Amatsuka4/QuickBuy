import { Modal } from "./BaseModal";
import { useState } from "react";
import { addProduct } from "../../utils/debug/debug";

export default function DebugModal({
	isOpenModalId,
	setIsModalOpen,
}: {
	isOpenModalId: string | null;
	setIsModalOpen: (isModalOpen: string | null) => void;
}) {
	const [form, setForm] = useState({
		createdAt: new Date().toISOString(),
		description: "",
		name: "",
		productId: "",
		status: "available",
		variations: [{ id: "", label: "", price: 0, stock: 0, uuid: "" }],
		tags: "",
		username: "",
	});

	return (
		<Modal isOpen={isOpenModalId === "debug"} onClose={() => setIsModalOpen(null)}>
			<div
				className="relative bg-white rounded-lg p-8 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					className="absolute top-2 right-4 z-[999] p-1 text-black hover:text-gray-700 transition-colors cursor-pointer"
					onClick={() => setIsModalOpen(null)}
				>
					X
				</button>
				<h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">ダミーデータ生成</h1>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						// タグをカンマ区切りで分割して配列に変換
						const tagsArray = form.tags
							.split(",")
							.map((tag) => tag.trim())
							.filter((tag) => tag.length > 0);

						const formDataWithTags = {
							...form,
							tags: tagsArray,
						};

						addProduct(form.username, formDataWithTags);
						console.log("フォームデータ送信: ", formDataWithTags);
					}}
				>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2">作成日時</label>
						<input
							type="text"
							value={form.createdAt}
							readOnly
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2">説明</label>
						<textarea
							value={form.description}
							onChange={(e) =>
								setForm({
									...form,
									description: e.target.value,
								})
							}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2">名前</label>
						<input
							type="text"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2">プロダクトID</label>
						<input
							type="text"
							value={form.productId}
							onChange={(e) => setForm({ ...form, productId: e.target.value })}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2">ステータス</label>
						<input
							type="text"
							value={form.status}
							onChange={(e) => setForm({ ...form, status: e.target.value })}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2">バリエーション</label>
						{form.variations.map((variation, index) => (
							<div key={index} className="mb-2">
								<input
									type="text"
									placeholder="ID"
									value={variation.id}
									onChange={(e) => {
										const newVariations = [...form.variations];
										newVariations[index].id = e.target.value;
										setForm({
											...form,
											variations: newVariations,
										});
									}}
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								/>
								<input
									type="text"
									placeholder="ラベル"
									value={variation.label}
									onChange={(e) => {
										const newVariations = [...form.variations];
										newVariations[index].label = e.target.value;
										setForm({
											...form,
											variations: newVariations,
										});
									}}
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								/>
								<input
									type="number"
									placeholder="価格"
									value={variation.price}
									onChange={(e) => {
										const newVariations = [...form.variations];
										newVariations[index].price = Number(e.target.value);
										setForm({
											...form,
											variations: newVariations,
										});
									}}
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								/>
								<input
									type="number"
									placeholder="在庫数"
									value={variation.stock}
									onChange={(e) => {
										const newVariations = [...form.variations];
										newVariations[index].stock = Number(e.target.value);
										setForm({
											...form,
											variations: newVariations,
										});
									}}
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								/>
								<input
									type="text"
									placeholder="UUID"
									value={variation.uuid}
									onChange={(e) => {
										const newVariations = [...form.variations];
										newVariations[index].uuid = e.target.value;
										setForm({
											...form,
											variations: newVariations,
										});
									}}
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								/>
								<button
									type="button"
									onClick={() => {
										const newVariations = form.variations.filter((_, i) => i !== index);
										setForm({
											...form,
											variations: newVariations,
										});
									}}
									className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
								>
									削除
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={() =>
								setForm({
									...form,
									variations: [
										...form.variations,
										{
											id: "",
											label: "",
											price: 0,
											stock: 0,
											uuid: "",
										},
									],
								})
							}
							className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
						>
							バリエーションを追加
						</button>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2">タグ（カンマ区切りで複数入力）</label>
						<input
							type="text"
							value={form.tags}
							onChange={(e) => setForm({ ...form, tags: e.target.value })}
							placeholder="例: 電子機器, スマートフォン, 最新モデル"
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2">ユーザー名</label>
						<input
							type="text"
							value={form.username}
							onChange={(e) => setForm({ ...form, username: e.target.value })}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</div>
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						送信
					</button>
				</form>
			</div>
		</Modal>
	);
}
