import { createContext, Provider } from "react"

interface AuthContext {
    isInitialized: boolean;
    isLoggedIn: boolean
}

const AuthContext = createContext<AuthContext>({isInitialized: false, isLoggedIn: false});

export default function AuthProviderContext() {

    return (

    )
}