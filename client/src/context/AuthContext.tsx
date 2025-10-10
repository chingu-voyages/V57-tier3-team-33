import { useContext, useEffect, useState, createContext, ReactNode } from "react";
import { auth } from "../config/firebase";
import { GithubAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { signIn } from "../services/AuthenticationService";

interface User {
    username: string,
    avatarUrl: string
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    logIn: (redirectPath?: string) => Promise<void>;
    logOut: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextType);

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                setUser(null)
            }
        })
        return unsubscribe;
    }, []);

    async function logIn(redirectPath?: string) {
        setLoading(true);
        setError(null);

        try {
            const provider = new GithubAuthProvider();

            provider.addScope("repo");
            provider.addScope("user");

            const result = await signInWithPopup(auth, provider);

            const credential = GithubAuthProvider.credentialFromResult(result);
            const githubAccessToken = credential?.accessToken;

            if (!githubAccessToken) throw new Error("Github login failed: no access token")

            const user = result.user;
            const idToken = await user.getIdToken();

            const data = await signIn(idToken, githubAccessToken);

            if (!data) throw new Error("Login failed: server did not return user data");

            const { username, avatarUrl } = data;

            localStorage.setItem("user", JSON.stringify({ username, avatarUrl }))
            setUser({ username, avatarUrl });

            navigate(redirectPath || "/dashboard");
        } catch (err: any) {
            setError(err.message || "An unexpected error occured");
        } finally {
            setLoading(false);
        }
    }

    async function logOut() {
        auth.signOut();
        localStorage.removeItem("user");
        navigate("/")
    }

    const value = {
        user,
        loading,
        error,
        logIn,
        logOut
    };

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )
}