import { auth } from "../firebase.ts";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";

export function handleSignUp(email: string, password: string) {
	return createUserWithEmailAndPassword(auth, email, password);
}

export function handleSignIn(email: string, password: string) {
	return signInWithEmailAndPassword(auth, email, password);
}
