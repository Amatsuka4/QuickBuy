import type { Product } from "../types/product";

export function tagCount(products: Product[]) {
    const tagCountMap: { [tag: string]: number } = {};
    products.forEach((product) => {
        product.tags.forEach((tag) => {
            tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
        });
    });
    // エントリをカウント順でソート
    const sortedEntries = Object.entries(tagCountMap).sort((a, b) => b[1] - a[1]);
    // ソート後の順序で新しいオブジェクトを作成
    const sortedTagCount: { [tag: string]: number } = {};
    sortedEntries.forEach(([tag, count]) => {
        sortedTagCount[tag] = count;
    });
    return sortedTagCount;
}