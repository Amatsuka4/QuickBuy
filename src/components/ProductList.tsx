import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";

async function fetchProducts(username: string) {
    const products = await getProducts(username);
    return products;
}

function ProductCard({ product }: { product: any }) {
    return (
        <div className="border border-gray-300 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <img
                src="https://picsum.photos/200/300" //{product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-md"
            />
            <div className="p-4">
                <h1 className="text-xl mb-2">{product.name}</h1>
                <p className="text-sm text-gray-500 mb-2">
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
                                  ...product.variations.map((v: any) => v.price)
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
        <div className="w-3/4 mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-10">Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.productId} product={product} />
                ))}
            </div>
        </div>
    );
}
