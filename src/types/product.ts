import type { Timestamp } from "firebase/firestore";


export interface Product {
	name: string;
	productId: string;
	description: string;
	imageUrl: string;
	createdAt: Timestamp;
	status: string;
	variations: Variation[];
	tags: string[];
}

export interface Variation {
	id: string;
	label: string;
	price: number;
	stock: number;
	uuid: string;
}