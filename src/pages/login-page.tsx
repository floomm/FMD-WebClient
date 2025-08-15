import {LoginForm} from "@/components/login-form"
import {useAuth} from "@/lib/auth.tsx";
import {useNavigate} from "react-router";
import {useEffect} from "react";

export default function LoginPage() {
    const {isAuthenticated, initializing} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!initializing && isAuthenticated) {
            navigate("/", {replace: true});
        }
    }, [isAuthenticated, initializing, navigate]);

    if (initializing) return null;

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm/>
            </div>
        </div>
    );
}
