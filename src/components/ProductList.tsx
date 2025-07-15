import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import type { Product, Variation } from "../types/product";
import { tagCount } from "../utils/tagCount";

async function fetchProducts(username: string) {
    const products = await getProducts(username);
    return products;
}

function ProductCard({ product }: { product: Product }) {
    return (
        <div className="flex flex-col h-full border border-gray-300 rounded-md shadow-md hover:shadow-lg hover:scale-101 transition-all duration-300 cursor-pointer">
            <img
                src="https://picsum.photos/200/300" //{product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-md"
            />
            <div className="p-4 flex flex-col gap-2 flex-1 h-full">
                <p className="text-sm text-blue-500">
                    {product.tags.map((tag, idx) => (
                        <span
                            key={idx}
                            className="mr-1 text-blue-500 hover:text-blue-700"
                        >
                            #{tag}
                        </span>
                    ))}
                </p>
                <h1 className="text-xl truncate">{product.name}</h1>
                <p className="text-sm text-gray-500 col-span-2 line-clamp-2 h-10">
                    {product.description}
                </p>
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        {product.variations.length}バリエーション
                    </p>
                    <p className="text-sm text-gray-700 font-bold">
                        ￥
                        {product.variations && product.variations.length > 0
                            ? Math.min(
                                  ...product.variations.map(
                                      (v: Variation) => v.price
                                  )
                              ).toLocaleString()
                            : "-"}
                        {product.variations.length === 1 ? "" : "~"}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ProductList({ username }: { username: string }) {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetchProducts(username).then((products) => {
            setProducts(products as Product[]);
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

    if (products.length === 0) {
        return (
            <div className="w-3/4 mx-auto mt-10">
                <p className="text-gray-500 text-center">商品がありません</p>
            </div>
        );
    }

    return (
        <div className="w-3/4 mx-auto mt-10">
            <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(tagCount(products)).map(([tag, count]) => (
                    <span key={tag} className="text-xm text-gray-500">
                        #{tag} ({count})
                    </span>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.productId} product={product} />
                ))}
            </div>
        </div>
    );
}
