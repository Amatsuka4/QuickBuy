import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
	displayName: string;
	username: string;
	createdAt: Timestamp;
	iconUrl: string;
}

export interface UserFormData {
	name: string;
	id: string;
	email: string;
	password: string;
}