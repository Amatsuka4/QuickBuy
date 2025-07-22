import type { Timestamp } from "firebase/firestore";


export interface Product {
	_placeholder: boolean;
	name: string;
	productId: string;
	description: string;
	imageUrl: string;
	createdAt: Timestamp;
	status: "available" | "sold" | "hidden";
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