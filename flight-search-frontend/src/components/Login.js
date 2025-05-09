import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import styles from './AuthForm.module.css';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" or "error"
    
    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLogin(); 
        } catch (err) {
            setMessage(err.message || "Something went wrong.");
            setMessageType("error");
        }
    };

    return (
        <div className={styles['auth-container']}>
            <h2>Log In</h2>
            <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Log In</button>

            {message && (
                <p className={`${styles.message} ${styles[messageType]}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
