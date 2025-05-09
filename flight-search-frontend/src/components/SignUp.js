import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function SignUp({ onBack }) {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");       // ✅ message to display
    const [messageType, setMessageType] = useState(""); // "success" or "error"

    const handleSignUp = async () => {
        try {
            if (!username || !firstName || !lastName || !email || !password) {
                setMessage("Please fill in all required fields.");
                setMessageType("error");
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const response = await fetch("http://localhost:8080/db_manager/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    firstName,
                    lastName,
                    email
                })
            });

            if (!response.ok) {
                throw new Error("Server error while registering user.");
            }

            setMessage("Account created successfully!");
            setMessageType("success");
        } catch (err) {
            setMessage(err.message || "Something went wrong.");
            setMessageType("error");
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
            <input placeholder="First Name" onChange={e => setFirstName(e.target.value)} />
            <input placeholder="Last Name" onChange={e => setLastName(e.target.value)} />
            <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleSignUp}>Create Account</button>
            <button onClick={onBack}>Back</button>

            {/* ✅ Message display block */}
            {message && (
                <p style={{ color: messageType === "success" ? "green" : "red", marginTop: "10px" }}>
                    {message}
                </p>
            )}
        </div>
    );
}
