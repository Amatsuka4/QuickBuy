import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { auth } from "../firebase";

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}
	return context;
}

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const value: AuthContextType = {
		user,
		isLoading,
	};

	useEffect(() => {
		const unsubscribed = auth.onAuthStateChanged((user) => {
			console.log(user);
			setUser(user);
			setIsLoading(false);
		});
		return () => {
			unsubscribed();
		};
	}, []);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
