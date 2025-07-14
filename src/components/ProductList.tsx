import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";

async function fetchProducts(username: string) {
	const products = await getProducts(username);
	return products;
}

export default function ProductList({ username }: { username: string }) {
	const [products, setProducts] = useState<any[]>([]);

	useEffect(() => {
		fetchProducts(username).then((products) => {
			setProducts(products);
		});
	}, [username]);

	// データ構造のメモ
	// /users/{uid}/products/discord-nitro
	//   ├── name: "Discord Nitro"
	//   ├── productId: "discord-nitro"
	//   ├── description: "限定オファー"
	//   ├── imageUrl: "..."
	//   ├── createdAt: Timestamp
	//   ├── status: "active" | "archived"
	//   └── variations: [
	//         {
	//           id: "nitro-1mo",
	//           label: "1ヶ月",
	//           price: 100,
	//           stock: 3,
	//           uuid: "内部ID" これを元に別のコレクションで管理している商品を取得する
	//         },
	//         {
	//           id: "nitro-3mo",
	//           label: "3ヶ月",
	//           price: 250,
	//           stock: 1,
	//           uuid: "内部ID" これを元に別のコレクションで管理している商品を取得する
	//         }
	//       ]

	return (
		<div>
			{products.map((product) => (
				<div key={product.productId}>
					<h1>{product.name}</h1>
					<p>{product.description}</p>
				</div>
			))}
		</div>
	);
}
