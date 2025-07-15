import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export async function addProduct(username: string, productData: any) {
    try {
        const productRef = doc(db, `users/${username}/products`, productData.productId);
        await setDoc(productRef, productData);
        console.log("データがFirestoreに保存されました。");
    } catch (error) {
        console.error("Firestoreへのデータ保存中にエラーが発生しました: ", error);
    }
}
