import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import PasswordInput from "./PasswordInput";
import styles from "./AuthForm.module.scss";
import { useToast } from "../../context/ToastContext";

const LoginForm: React.FC = () => {
    const { login } = useContext(AuthContext);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await authService.loginLocal({ email, password });

        if (!res.success || !res.data) {
            const msg = res.message ?? "Login failed.";

            showToast(
                <>
                    {msg} Please check your details and try again.
                </>
            );


            setLoading(false);
            return;
        }

        const username = res.data.user.username;

        login({
            userId: res.data.user.userId,
            token: res.data.token,
            username
        });

        showToast(
            <>
                Logged in successfully!{" "}
                <Link to={`/profile/${username}`}>
                    View Profile
                </Link>
            </>
        );

        setLoading(false);
        navigate(`/profile/${username}`);
    };

    return (
        <div className={`${styles.authContainer} ${styles.authContainerLogin}`}>
            <h2>Login</h2>

            <p className={styles.subtitle}>
                Demo only — data stays in your browser (localStorage), never sent anywhere.
            </p>

            <form onSubmit={handleSubmit} className={styles.authForm}>
                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <PasswordInput
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    show={showPassword}
                    onToggle={() => setShowPassword((prev) => !prev)}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <div className={styles.switchAuth}>
                Don't have an account?{" "}
                <Link to="/signup" className={styles.switchLink}>
                    Sign up
                </Link>
            </div>
        </div>
    );
};

export default LoginForm;