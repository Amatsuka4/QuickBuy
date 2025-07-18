import { useState, useEffect, useMemo } from "react";
import { getProducts } from "../services/productService";
import type { Product, Variation } from "../types/product";
import { tagCount } from "../utils/tagCount";

async function fetchProducts(username: string) {
	const products = await getProducts(username);
	return products;
}

// タグでのフィルターのカスタムフック
const useProductFilter = (products: Product[], selectedTags: string[], searchQuery: string) => {
	return useMemo(() => {
		if (selectedTags.length === 0 && searchQuery === "") return products;
		return products.filter((product) => {
			const matchesTags = selectedTags.every((tag) => product.tags.includes(tag));
			const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesTags && matchesSearch;
		});
	}, [products, selectedTags, searchQuery]);
};

function ProductCard({
	product,
	handleTagClick,
	handleProductClick,
}: {
	product: Product;
	handleTagClick: (tag: string) => void;
	handleProductClick: (id: string, product: Product) => void;
}) {
	return (
		<div
			className="relative flex flex-col h-full border border-gray-300 rounded-md shadow-md hover:shadow-lg hover:scale-101 hover:border-blue-500 transition-all duration-300 cursor-pointer"
			onClick={() => handleProductClick(product.productId, product)}
		>
			{/* 商品ステータスバッジ */}
			<div className="absolute top-4 left-4">
				<span
					className={`px-3 py-1 rounded-full text-xs font-medium ${
						product.status === "available"
							? "bg-green-100 text-green-800"
							: product.status === "soldOut"
							? "bg-gray-100 text-gray-800"
							: "bg-yellow-100 text-yellow-800"
					}`}
				>
					{product.status === "available" ? "販売中" : product.status === "soldOut" ? "売り切れ" : "非公開"}
				</span>
			</div>
			<img
				src="https://picsum.photos/800/800" //{product.imageUrl}
				alt={product.name}
				className="w-full h-48 object-cover rounded-t-md"
			/>
			<div className="p-4 flex flex-col gap-2 flex-1 h-full">
				<p className="text-sm text-blue-500">
					{product.tags.map((tag, idx) => (
						<span
							key={idx}
							className="mr-1 text-blue-500 hover:text-blue-700"
							onClick={() => handleTagClick(tag)}
						>
							#{tag}
						</span>
					))}
				</p>
				<h1 className="text-xl truncate">{product.name}</h1>
				<p className="text-sm text-gray-500 col-span-2 line-clamp-2 h-10">{product.description}</p>
				<div className="flex justify-between items-center">
					<p className="text-sm text-gray-500">{product.variations.length}バリエーション</p>
					<p className="text-sm text-gray-700 font-bold">
						￥
						{product.variations && product.variations.length > 0
							? Math.min(...product.variations.map((v: Variation) => v.price)).toLocaleString()
							: "-"}
						{product.variations.length === 1 ? "" : "~"}
					</p>
				</div>
			</div>
		</div>
	);
}

export default function ProductList({
	username,
	handleProductClick,
}: {
	username: string;
	handleProductClick: (id: string, product: Product) => void;
}) {
	const [products, setProducts] = useState<Product[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");

	// ページ遷移時にタグ選択をリセット
	useEffect(() => {
		setSelectedTags([]);
		setSearchQuery("");
	}, [username]);

	// 商品の取得
	useEffect(() => {
		fetchProducts(username).then((products) => {
			setProducts(products as Product[]);
		});
	}, [username]);

	// 絞り込み
	const filteredProducts = useProductFilter(products, selectedTags, searchQuery);

	// タグのクリック
	function handleTagClick(tag: string) {
		if (selectedTags.includes(tag)) {
			setSelectedTags((prev) => prev.filter((t) => t !== tag));
		} else {
			setSelectedTags((prev) => [...prev, tag]);
		}
	}

	if (products.length === 0) {
		return (
			<div className="w-3/4 mx-auto mt-10">
				<p className="text-gray-500 text-center">商品がありません</p>
			</div>
		);
	}

	return (
		<div className="w-3/4 mx-auto">
			<p className="text-sm text-gray-500 mb-2">絞り込み</p>
			<div className="w-full flex flex-between mb-4 gap-2">
				{/* タグフィルター */}
				<div className="flex flex-wrap gap-2 mb-4 flex-3">
					{Object.entries(tagCount(products)).map(([tag, count]) => (
						<span
							key={tag}
							className={`text-xm rounded-md px-2 py-1 cursor-pointer transition-colors duration-200 ${
								selectedTags.includes(tag)
									? "text-white bg-blue-500 hover:bg-blue-600"
									: "text-gray-500 bg-gray-100 hover:bg-gray-200"
							}`}
							onClick={() => handleTagClick(tag)}
						>
							#{tag} ({count})
						</span>
					))}
				</div>
				{/* 検索バー */}
				<div className="flex-1">
					<div className="relative">
						<input
							className="appearance-none border-1 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
							type="text"
							placeholder="検索"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<div
							className="absolute right-0 inset-y-0 flex items-center cursor-pointer"
							onClick={() => setSearchQuery("")}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="-ml-1 mr-3 h-5 w-5 text-gray-400 hover:text-gray-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{filteredProducts.map((product) => (
					<ProductCard
						key={product.productId}
						product={product}
						handleTagClick={handleTagClick}
						handleProductClick={handleProductClick}
					/>
				))}
			</div>
		</div>
	);
}
