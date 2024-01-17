import { Link, useParams } from "react-router-dom";
import useFetch from "./../Hooks/useFetch";
import { Spinner } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";

const Groups = () => {
  const { data: groups, isLoading } = useFetch("/groups");
  console.log(groups);
  const { groupId } = useParams();

  function createdItemDate(date) {
    const timestamp = date;
    const dateObject = new Date(timestamp);

    const timeString = dateObject.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const dateString = dateObject.toLocaleDateString("en-GB"); // Adjust the locale based on your preference

    const time = timeString;
    const dateTime = dateString;
    return (`${time},${dateTime}`)
  }

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        groups && (
          <div className="container">
            {groups.map((group) => {
              if (group._id === groupId) {
                return (
                  <div key={group._id} className="p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h1 className="text-light" to={`/main/groups`}>
                        {group.name}
                      </h1>
                      <div className="d-flex justify-content-between align-items-center gap-3">
                        <div className="bg-light p-2 rounded d-flex gap-3 ">
                          <span>Owner: </span>
                          <span className="text-capitalize d-flex align-items-center gap-1">
                            <span className="badge bg-primary">
                              {group.owner.name.slice(0, 1)}
                            </span>
                            <span>{group.owner.name}</span>(
                            <span className="text-secondary">
                              {group.owner.username}
                            </span>
                            )
                          </span>
                        </div>
                        <Dropdown>
                          <Dropdown.Toggle variant="light" id="dropdown-basic">
                            <i className="fa-solid fa-ellipsis"></i>
                            {/* <i className="fa-solid fa-chevron-down"></i> */}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <button
                                className="btn btn-light w-100 text-start"
                                // onClick={
                                //     handleLogout
                                // }
                              >
                                Add Member
                              </button>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <button
                                className="btn btn-light w-100 text-start"
                                // onClick={
                                //     handleLogout
                                // }
                              >
                                <Link
                                  className="text-decoration-none text-dark"
                                  role="button"
                                  to={"/main"}
                                >
                                  Leave Group
                                </Link>
                              </button>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>

                    <div className="row flex-fill overflow-hidden gx-5">
                      <div className="col-xl-6 h-100 overflow-hidden d-flex flex-column">
                        <div className="p-3 bg-white rounded-3 d-flex flex-column gap-1 h-100">
                          <div className="d-flex justify-content-between">
                            <h4>
                              Items{" "}
                              <span className="badge bg-primary">
                                {group.items.length}
                              </span>
                            </h4>
                            <form>
                              <div className="d-flex gap-1">
                                <input
                                  type="text"
                                  placeholder="Title"
                                  className="form-control"
                                  name="title"
                                />
                                <button className="btn btn-primary">
                                  <i className="fa-solid fa-plus"></i>
                                </button>
                              </div>
                            </form>
                          </div>
                          <div className="h-100 overflow-auto">
                            <ul className="list-group">
                              {group.items.map((item) => {
                                if (item.group === groupId) {
                                  return (
                                    <li
                                      key={item._id}
                                      className="list-group-item text-capitalize d-flex justify-content-between align-items-center gap-3"
                                    >
                                      <div className="d-flex align-items-center gap-3">
                                        <span className="badge bg-primary fs-5">
                                          {item.title.slice(0, 1)}
                                        </span>
                                        <div>
                                          <span>{item.title}</span>
                                          <br />
                                          <span className="text-secondary">
                                            Created by {item.owner.name}  {" "}
                                            ({createdItemDate(item.createdAt)})
                                          </span>
                                        </div>
                                      </div>
                                      <div className="d-flex gap-1">
                                        <button className="btn btn-success">
                                            <i className="fa-solid fa-cart-plus"></i>
                                        </button>
                                      </div>
                                    </li>
                                  );
                                }
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 h-100 overflow-hidden d-flex flex-column">
                        <div className="p-3 bg-white rounded-3 d-flex flex-column gap-1 h-100">
                          <div className="d-flex justify-content-between">
                            <h4>
                              Items{" "}
                              <span className="badge bg-primary">
                                {group.members.length}
                              </span>
                            </h4>
                          </div>
                          <div className="h-100 overflow-auto">
                            <ul className="list-group">
                              {/* {member.map((member) => {
                                                              if (group._id === groupId) {
                                                                return (
                                                                  <li key={member._id} className="list-group-item text-capitalize d-flex justify-content-between align-items-start gap-3 flex-column">
                                                                <div className="d-flex align-items-center gap-3">
                                                                  <p>{member.name}</p>
                                                                </div>
                                                            </li>
                                                                )
                                                              }
                                                            })} */}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )
      )}
    </div>
  );
};

export default Groups;
