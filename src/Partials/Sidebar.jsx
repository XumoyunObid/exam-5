import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../Hooks/useFetch";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Button, Spinner } from "react-bootstrap";
import Popover from "react-bootstrap/Popover";
import { toast } from "react-toastify";
import axios from "axios";
import { reqTokenHederKey } from "../constants";


const Sidebar = () => {
    const { data: groups, isLoading } = useFetch("/groups");

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    


    ////////////////////////////////////////// Create group button ///////////////////////////////////////////////////
    async function handleCreateGroup(e) {
        e.preventDefault();
        if (!name) return toast("Name is required!", { type: "error" });
        if (!password) return toast("Password is required!", { type: "error" });
        if (password.length < 6)
            return toast("Password must be at least 6 characters long!", {
                type: "error",
            });
        setLoading(true);
        try {
            let {
                data: { token },
            } = await axios.post("/groups", { name, password });

            toast("Group created successfully", { type: "success" });
            axios.defaults.headers.common[reqTokenHederKey] = token;
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
            setTimeout(() => {
                window.location.reload()
            }, 1_200);
        }
    }

    ////////////////////////////////////// Popover ///////////////////////////////////////////////////
    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h2">Groups name and password</Popover.Header>
            <Popover.Body>
                <form className="d-grid gap-2" onSubmit={handleCreateGroup}>
                    <input
                    value={name}
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Group Name"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                    value={password}
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Group Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="d-flex gap-3">
                        <Button
                            type="submit"
                            variant="primary"
                            className="btn flex-fill"
                            disabled={loading}
                        >
                            {loading ? <Spinner /> : "Create"}
                        </Button>
                        {/* <button type="button" className="btn btn-outline-primary flex-fill">Cancel</button> */}
                    </div>
                </form>
            </Popover.Body>
        </Popover>
    );

    ///////////////////// Totggle button function ////////////////////////////////
    const [isClassApplied, setIsClassApplied] = useState(false);
    const handleToggleClass = () => {
        setIsClassApplied(!isClassApplied);
    };
    

    return (
        <aside className="text-white h-100 border-end py-3 bg-white overflow-auto">
            {isLoading ? (
                <Spinner />
            ) : (
                groups && (
                    <ul className="p-0 px-2 d-flex flex-column gap-3">
                        <li>
                            <Link
                                className="navigation-link text-decoration-none text-black btn btn-light w-100 text-start"
                                to={"/main"}
                            >
                                <i className="fa-solid fa-user text-primary"></i>{" "}
                                Profile
                            </Link>
                        </li>
                        <li className="d-grid gap-3">
                            <button
                                onClick={handleToggleClass}
                                className="navigation-link btn btn-light w-100 text-start"
                            >
                                <i className="fa-regular fa-comments text-primary"></i>{" "}
                                Groups
                            </button>
                            <ul
                                className={
                                    isClassApplied
                                        ? "d-none"
                                        : "list-unstyled ps-3 d-grid gap-3"
                                }
                            >
                                <li>
                                    <OverlayTrigger
                                        trigger="click"
                                        placement="right"
                                        overlay={popover}
                                    >
                                        <button
                                            className="navigation-link btn btn-light w-100 text-start text-dark"
                                            type="button"
                                        >
                                            <i className="fa-solid fa-add text-primary"></i>
                                            Create Group
                                        </button>
                                    </OverlayTrigger>
                                </li>
                                {groups.map((group) => {
                                    return (
                                        <li key={group._id}>
                                                <Link
                                                className="navigation-link text-decoration-none text-dark btn btn-light w-100 text-start"
                                                to={`/main/groups/${group._id}`}
                                            >
                                                {group.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    </ul>
                )
            )}
        </aside>
    );
};

export default Sidebar;
