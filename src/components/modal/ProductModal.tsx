import { Modal } from "./BaseModal";
import type { Product } from "../../types/product";
import { useState, useEffect } from "react";
import CloseButton from "./CloseButton";

interface ProductModalProps {
	product: Product; // nullを許可しない
	isOpenModalId: string | null;
	setIsModalOpen: (id: string | null) => void;
}

export default function ProductModal({ product, isOpenModalId, setIsModalOpen }: ProductModalProps) {
	const [selectedVariation, setSelectedVariation] = useState(
		product.variations && product.variations.length > 0 ? product.variations[0] : null
	);
	const [quantity, setQuantity] = useState(1);

	// バリエーションの選択リセット
	useEffect(() => {
		if (isOpenModalId !== null) {
			setSelectedVariation(product.variations && product.variations.length > 0 ? product.variations[0] : null);
			setQuantity(1);
		}
	}, [isOpenModalId, product.variations]);

	// 別のバリエーション選択時、在庫数を超える場合は1にリセット
	useEffect(() => {
		if (selectedVariation && quantity > selectedVariation.stock) {
			setQuantity(1);
		}
	}, [selectedVariation, quantity]);

	// 数量変更のハンドラー
	const handleQuantityChange = (newQuantity: number) => {
		if (newQuantity < 1) return;
		if (selectedVariation && newQuantity > selectedVariation.stock) return;
		setQuantity(newQuantity);
	};

	// 購入個数に応じた合計金額
	const totalPrice = selectedVariation ? selectedVariation.price * quantity : 0;

	return (
		<Modal isOpen={isOpenModalId !== null} onClose={() => setIsModalOpen(null)}>
			<div
				className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				{/* 閉じるボタン */}
				<CloseButton onClick={() => setIsModalOpen(null)} />

				<div className="flex flex-col lg:flex-row h-full">
					{/* 商品画像 */}
					<div className="lg:w-1/2 bg-gray-50">
						<div className="relative h-80 lg:h-full">
							<img
								src={product.imageUrl || "https://picsum.photos/800/800"}
								alt={product.name}
								className="w-full h-full object-cover"
							/>
							{/* 商品ステータスバッジ */}
							<div className="absolute top-4 left-4">
								<span
									className={`px-3 py-1 rounded-full text-xs font-medium ${
										product.status === "available"
											? "bg-green-100 text-green-800"
											: product.status === "inactive"
											? "bg-gray-100 text-gray-800"
											: "bg-yellow-100 text-yellow-800"
									}`}
								>
									{product.status === "available"
										? "販売中"
										: product.status === "inactive"
										? "非公開"
										: "準備中"}
								</span>
							</div>
						</div>
					</div>

					{/* 商品情報 */}
					<div className="lg:w-1/2 p-6 lg:p-8 flex flex-col overflow-y-auto max-h-[90vh]">
						{/* 商品名 */}
						<h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

						{/* タグ */}
						{product.tags && product.tags.length > 0 && (
							<div className="mb-4">
								<div className="flex flex-wrap gap-2">
									{product.tags.map((tag, index) => (
										<span
											key={index}
											className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
						)}

						{/* 商品説明 */}
						<p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

						{/* バリエーション選択 */}
						{product.variations && product.variations.length > 0 && (
							<div className="mb-6">
								<h3 className="text-sm font-semibold text-gray-700 mb-3">バリエーション</h3>
								<div className="grid grid-cols-2 gap-3">
									{product.variations.map((variation) => (
										<button
											key={variation.id}
											onClick={() => setSelectedVariation(variation)}
											className={`p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
												selectedVariation?.id === variation.id
													? "border-blue-500 bg-blue-50 text-blue-700"
													: "border-gray-200 hover:border-gray-300 bg-white"
											}`}
										>
											<p className="text-sm font-medium">{variation.label}</p>
											<p className="text-lg font-bold text-gray-900">
												¥{variation.price.toLocaleString()}
											</p>
											<p className="text-xs text-gray-500">在庫: {variation.stock}個</p>
										</button>
									))}
								</div>
							</div>
						)}

						{/* 価格表示 */}
						{selectedVariation && (
							<div className="mb-6">
								<div className="text-2xl font-bold text-gray-900">
									¥{selectedVariation.price.toLocaleString()}
								</div>
								<div className="text-sm text-gray-500">在庫: {selectedVariation.stock}個</div>
							</div>
						)}

						{/* 数量選択 */}
						{selectedVariation && (
							<div className="mb-6">
								<h3 className="text-sm font-semibold text-gray-700 mb-3">購入数量</h3>
								<div className="flex items-center gap-4">
									<div className="flex items-center border border-gray-300 rounded-lg">
										<button
											onClick={() => handleQuantityChange(quantity - 1)}
											disabled={quantity <= 1}
											className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M20 12H4"
												/>
											</svg>
										</button>
										<input
											type="number"
											value={quantity}
											onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
											min="1"
											max={selectedVariation.stock}
											className="w-16 text-center py-2 border-0 focus:ring-0 focus:outline-none"
										/>
										<button
											onClick={() => handleQuantityChange(quantity + 1)}
											disabled={quantity >= selectedVariation.stock}
											className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 4v16m8-8H4"
												/>
											</svg>
										</button>
									</div>
									<span className="text-sm text-gray-500">最大 {selectedVariation.stock}個まで</span>
								</div>
							</div>
						)}

						{/* 合計金額 */}
						{selectedVariation && (
							<div className="mb-6 p-4 bg-gray-50 rounded-lg">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600">合計金額</span>
									<span className="text-2xl font-bold text-gray-900">¥{totalPrice.toLocaleString()}</span>
								</div>
								<div className="text-xs text-gray-500 mt-1">
									¥{selectedVariation.price.toLocaleString()} × {quantity}個
								</div>
							</div>
						)}

						{/* アクションボタン */}
						<div className="mt-6 flex gap-3">
							<button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
								この商品を購入する
							</button>
							<button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
}
