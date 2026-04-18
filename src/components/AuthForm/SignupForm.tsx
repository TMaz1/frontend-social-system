import React, { useState, useContext } from "react";
import { authService } from "../../services/authService";
import styles from "./AuthForm.module.scss";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput";
import { useToast } from "../../context/ToastContext";

const SignupForm: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { login } = useContext(AuthContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showToast("Passwords do not match. Please check and try again.");
            return;
        }

        setLoading(true);

        const res = await authService.registerLocal({
            name,
            email,
            password,
        });

        if (!res.success || !res.data) {
            const msg = res.message || "Registration failed.";

            showToast(`${msg}. Please try again.`);

            setLoading(false);
            return;
        }

        const usernameSlug = res.data.username;

        // Auto login
        login({
            userId: res.data.userId,
            token: btoa(`${res.data.userId}:${Date.now()}`),
            username: usernameSlug
        });

        showToast(
            <>
                Account created successfully!{" "}
                <Link to={`/profile/${usernameSlug}`}>
                    View Profile
                </Link>
            </>
        );

        // Navigate to their profile page
        navigate(`/profile/${usernameSlug}`);

        setLoading(false);
    };

    return (
        <div className={styles.authContainer}>
            <h2>Create Account</h2>

            <form onSubmit={handleSubmit} className={styles.authForm}>
                <input
                    type="text"
                    placeholder="Username"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

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

                <PasswordInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    show={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword((prev) => !prev)}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Sign Up"}
                </button>
            </form>

            <div className={styles.switchAuth}>
                Already have an account?{" "}
                <Link to="/login" className={styles.switchLink}>
                    Login
                </Link>
            </div>
        </div>
    );
};

export default SignupForm;