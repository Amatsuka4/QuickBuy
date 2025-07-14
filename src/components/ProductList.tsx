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

    return (
        <div>
            <h1>ProductList</h1>
        </div>
    );
}
