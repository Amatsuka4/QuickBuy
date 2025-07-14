import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getProducts(uid: string) {
	const productsRef = collection(db, "users", uid, "products");
    console.log(productsRef);
    const productsSnap = await getDocs(productsRef);
    console.log(productsSnap.docs);
    const products = productsSnap.docs.map((doc) => doc.data());
    return products;
}