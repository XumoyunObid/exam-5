import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";

const Navbar = () => {
    return (
        <nav className="d-flex justify-content-between align-items-center container-fluid">
            <div className="d-flex align-items-center gap-4">
                <i className="fa-solid fs-2 text-primary fa-blog"></i>
                <button className="btn btn-primary rounded-pill px-4">
                    + New
                </button>
            </div>
            <input
                type="text"
                placeholder="Search group and join..."
                className="px-3 py-2 border w-50 rounded"
            />
            <ul className="list-unstyled d-flex gap-3 m-0 p-0 align-items-center">
                <li>
                    <button className="btn rounded-circle">
                        <i className="fa-solid fa-refresh"></i>
                    </button>
                </li>
                <li className="position-relative">
                    <button className="btn rounded-circle">
                    <i className="fa-regular fa-bell"></i>
                    <span className="badge bg-danger position-absolute rounded-pill">
                        9+
                    </span>
                    </button>
                </li>
                <li>
                    <Dropdown>
                        <Dropdown.Toggle variant="" id="dropdown-basic">
                            <i className="fa-solid fa-cog"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">
                                Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
