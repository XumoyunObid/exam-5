import { useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../Hooks/useFetch";
import { Spinner } from "react-bootstrap";
const Sidebar = () => {
    const { data: groups, isLoading } = useFetch("/groups");
    console.log(groups);

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
                                className="text-decoration-none text-black btn btn-light w-100 text-start"
                                to={"/main"}
                            >
                                <i className="fa-solid fa-user text-primary"></i>{" "}
                                Profile
                            </Link>
                        </li>
                        <li className="d-grid gap-3">
                            <button
                                onClick={handleToggleClass}
                                className="btn btn-light w-100 text-start"
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
                                    <button className="btn btn-light w-100 text-start">
                                        <i className="fa-solid fa-add text-primary"></i>
                                        Create Group
                                    </button>
                                </li>
                                {groups.map((group) => {
                                    return (
                                        <li key={group._id}>{group.name}</li>
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
