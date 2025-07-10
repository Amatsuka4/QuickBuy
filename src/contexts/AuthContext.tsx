import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

interface UserProfile {
	displayName: string;
	userId: string;
}

interface AuthContextType {
	user: User | null;
	userProfile: UserProfile | null;
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
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const value: AuthContextType = {
		user,
		userProfile,
		isLoading,
	};

	useEffect(() => {
		const unsubscribed = auth.onAuthStateChanged(async (user) => {
			setUser(user);

			if (user) {
				try {
					const usernameRef = doc(db, "users", user.uid);
					const usernameSnap = await getDoc(usernameRef);
					if (usernameSnap.exists()) {
						console.log(usernameSnap.data());
						const userData = usernameSnap.data();
						setUserProfile(userData as UserProfile);
					} else {
						console.warn("ユーザープロファイルが見つかりませんでした");
						setUserProfile(null);
					}
				} catch (error) {
					console.error("ユーザープロファイルの取得に失敗しました:", error);
					setUserProfile(null);
				}
			} else {
				// ユーザーがログアウトした場合、プロファイルをクリア
				setUserProfile(null);
			}

			setIsLoading(false);
		});

		return () => {
			unsubscribed();
		};
	}, []);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
