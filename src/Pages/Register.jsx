import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { localTokenKey, reqTokenHederKey } from "../constants";
import { Button, Spinner } from "react-bootstrap";

const Register = () => {
    const [name, setName] = useState("");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        if (!name) return toast("Name is required!", { type: "error" });
        if (!username) return toast("Username is required!", { type: "error" });
        if (!password) return toast("Password is required!", { type: "error" });
        if (password.length < 6)
            return toast("Password must be at least 6 characters long!", {
                type: "error",
            });
        setLoading(true);

        try {
            let {
                data: { token },
            } = await axios.post("/users", { name, username, password });

            console.log(token);
            localStorage.setItem(localTokenKey, token);
            toast("Signed up successfully", { type: "success" });
            axios.defaults.headers.common[reqTokenHederKey] = token;
            navigate("/login");
        } catch (error) {
            if (error.response.status === 400) {
                error.response.data.errors.forEach((err) =>
                    toast(err.msg, { type: "error" })
                );
            } else {
                console.log(error);
            }
        } finally {
            setLoading(false);
        }
    }

    const token = localStorage.getItem(localTokenKey);
    if (token) return <Navigate to="/login" />;

    return (
        <div className="bg-secondary vh-100 d-flex align-items-center justify-content-center">
            <div className=" container d-flex">
                <div className="rounded-start-4 bg-dark text-white w-50 p-5 text-center">
                    <i className="fa-solid fa-blog fa-8x text-primary"></i>
                    <p className="mt-5">Welcome to </p>
                    <h1 className="display-1">Shopping List</h1>
                </div>
                <form
                    className="bg-light w-50 p-5 rounded-end-4 d-flex flex-column gap-3"
                    onSubmit={handleRegister}
                >
                    <h2 className="text-primary text-center">Register</h2>
                    <div className="d-flex flex-column gap-2">
                        <label htmlFor="name">Name</label>
                        <input
                            value={name}
                            id="name"
                            type="text"
                            placeholder="Eshmatjon"
                            className="border p-2 rounded"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="d-flex flex-column gap-2">
                        <label htmlFor="username">Username</label>
                        <input
                            value={username}
                            id="username"
                            type="text"
                            placeholder="eshmatjon123"
                            className="border p-2 rounded"
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                    <div className="d-flex flex-column gap-2">
                        <label htmlFor="password">Password</label>
                        <input
                            value={password}
                            id="password"
                            type="password"
                            placeholder="******"
                            className="border p-2 rounded"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="rounded-pill"
                    >
                        {loading ? <Spinner /> : "Sign up"}
                    </Button>
                    <p>
                        Already have an account?{" "}
                        <span>
                            <Link to={"/login"}>Log In.</Link>
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
