import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// ユーザーの商品一覧を取得
export async function getProducts(username: string) {
	const productsRef = collection(db, "users", username, "products");
    const productsSnap = await getDocs(productsRef);
    const products = productsSnap.docs.map((doc) => doc.data());
    console.log(products);
    return products;
}