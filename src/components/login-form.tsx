import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {type FormEvent, useEffect, useState} from "react";
import {useAuth} from "@/lib/auth.tsx";
import {useLocation, useNavigate} from "react-router";
import {GET_AUTH_TOKEN} from "@/components/auth.graphql.ts";
import {useLazyQuery} from "@apollo/client";

type GetAuthTokenResult = { tokenAuth: { token: string } | null };
type GetAuthTokenVars = { username: string; password: string; };

export function LoginForm({className, ...props}: React.ComponentProps<"div">) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {logIn} = useAuth();
    const navigate = useNavigate();
    const location = useLocation() as any;

    const [requestToken, {data, loading, error}] = useLazyQuery<
        GetAuthTokenResult,
        GetAuthTokenVars
    >(GET_AUTH_TOKEN, {fetchPolicy: "no-cache"});

    useEffect(() => {
        const token = data?.tokenAuth?.token;
        if (!token) return;

        (async () => {
            await logIn();
            const dest = location?.state?.from?.pathname ?? "/";
            navigate(dest, {replace: true});
        })();
    }, [data, logIn, navigate, location]);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!username || !password || loading) return;
        requestToken({variables: {username: username, password: password}});
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your username and password below
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} noValidate>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="username"
                                    required
                                    autoComplete="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-500" role="alert" aria-live="polite">
                                    Authentication failed. Please check your credentials and try again.
                                </p>
                            )}

                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Signing in..." : "Login"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
