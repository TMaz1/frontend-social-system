import React from "react";
import SignupForm from "../../components/AuthForm/SignupForm";
import SignupInfo from "../../components/SignupInfo/SignupInfo";
import styles from "./Signup.module.scss";

const Signup: React.FC = () => {
    return (
        <div className={styles.container}>
            <SignupInfo />
            <SignupForm />
        </div>
    );
};

export default Signup;