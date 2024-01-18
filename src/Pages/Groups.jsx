import { useParams, useNavigate } from "react-router-dom";
import useFetch from "./../Hooks/useFetch";
import { Spinner } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { localTokenKey, reqTokenHederKey } from "../constants";

const Groups = () => {
  const { data: groups, isLoading } = useFetch("/groups");
  console.log(groups);
  const { groupId } = useParams();
  const navigate = useNavigate()

  const { data: user } = useFetch("/auth");
  console.log(user);

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
    return `${time},${dateTime}`;
  }

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!title)
      return toast("Title is required in order to create an element!", {
        type: "error",
      });

    setLoading(true);

    try {
      let {
        data: { token, newItem },
      } = await axios.post("/items", { title, groupId });
      setItems((prevItems) => [...prevItems, newItem]);

      setTimeout(() => {
        window.location.reload()
      }, 1_200);
      toast("Item is created successfully!", { type: "success" });
      axios.defaults.headers.common[reqTokenHederKey] = token;
      console.log("Item created");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        error.response.data.errors.forEach((err) =>
          toast(err.msg, { type: "error" })
        );
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const [isBought, setIsBought] = useState(false);

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
                                Leave Group
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
                            <form onSubmit={handleAddItem}>
                              <div className="d-flex gap-1">
                                <input
                                  value={title}
                                  type="text"
                                  placeholder="Title"
                                  className="form-control"
                                  name="title"
                                  onChange={(e) => setTitle(e.target.value)}
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
                                          {item?.boughtBy ? (
                                            <span className="badge bg-info">
                                              Bought by {item.boughtBy.name}{" "}
                                              {createdItemDate(item.boughtAt)}
                                            </span>
                                          ) : null}
                                          <br />
                                          <span className="text-secondary">
                                            Created by {item.owner.name} (
                                            {createdItemDate(item.createdAt)})
                                          </span>
                                        </div>
                                      </div>
                                      <div className="d-flex gap-1">
                                        {!item?.boughtBy && !isBought ? 
                                        <button
                                        className="btn btn-success"
                                        onClick={async () => {
                                          try {
                                            const headers = {
                                              Authorization: `Bearer ${localTokenKey}`,
                                            };
                                              await axios.post(
                                                `/items/${item._id}/mark-as-bought`,
                                                {},
                                                { headers }
                                              );
                                              setTimeout(() => {
                                                window.location.reload()
                                              }, 1_200);
                                              toast(
                                                "Item is marked as bought successfully!",
                                                { type: "success" }
                                              );
                                              console.log(
                                                `Item with ID ${item._id} marked as bought successfully.`
                                              );
                                            setIsBought((prevIsBought) => !prevIsBought);
                                          } catch (error) {
                                            console.error(
                                              `Error marking item with ID ${item._id} as bought:`,
                                              error
                                            );
                                          }
                                        }}
                                      >
                                        <i className="fa-solid fa-cart-plus"></i>
                                      </button> : 
                                      <button className="btn btn-warning" onClick={async () => {
                                        try {
                                          const headers = {
                                            Authorization: `Bearer ${localTokenKey}`,
                                          };
                                            await axios.delete(
                                              `/items/${item._id}/mark-as-bought`,
                                              {},
                                              { headers }
                                            );
                                            setTimeout(() => {
                                              window.location.reload()
                                            }, 1_200);
                                            toast(
                                              "Item is marked as not bought successfully!",
                                              { type: "success" }
                                            );
                                            console.log(
                                              `Item with ID ${item._id} marked as bought successfully.`
                                            );
                                          setIsBought((prevIsBought) => !prevIsBought);
                                        } catch (error) {
                                          console.error(
                                            `Error marking item with ID ${item._id} as bought:`,
                                            error
                                          );
                                        }
                                      }}><i className="fa-solid fa-shop-slash"></i></button>
                                      }
                                      {item.owner._id === user._id && (
                                          <button className="btn btn-danger" onClick={async () => {
                                            try {
                                              const headers = {
                                                Authorization: `Bearer ${localTokenKey}`,
                                              };
                                                await axios.delete(
                                                  `/items/${item._id}`,
                                                  {},
                                                  { headers }
                                                );
                                                toast(
                                                  "Item is deleted successfully!",
                                                  { type: "success" }
                                                  );
                                                console.log(
                                                  `Item with ID ${item._id} deleted successfully.`
                                                );
                                            } catch (error) {
                                              console.error(
                                                `Error deleting item with ID ${item._id} as bought:`,
                                                error
                                              );
                                            }
                                            setTimeout(() => {
                                              window.location.reload()
                                            }, 1_200);
                                          }}>
                                            <i className="fa-solid fa-x"></i>
                                          </button>
                                        )}
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
                              Members{" "}
                              <span className="badge bg-primary">
                                {group.members.length}
                              </span>
                            </h4>
                          </div>
                          <div className="h-100 overflow-auto members">
                            <ul className="list-group">
                              {group.members.map((member) => {
                                if (group._id === groupId) {
                                  return (
                                    <li
                                      key={crypto.randomUUID()}
                                      className="list-group-item text-capitalize d-flex justify-content-between align-items-start gap-3"
                                    >
                                      <div className="d-flex align-items-center gap-3">
                                        <span className="badge bg-primary fs-5">
                                          {member.name.slice(0, 1)}
                                        </span>
                                        <div>
                                          <span>{member.name}</span>
                                          <br />
                                          <span className="text-secondary">
                                            {member.username}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="d-flex gap-1">
                                        {user._id === group.owner._id && (
                                          <button className="btn btn-danger" onClick={async () => {
                                            try {
                                              const headers = {
                                                Authorization: `Bearer ${localTokenKey}`,
                                              };
                                                await axios.delete(
                                                  `/groups/${groupId}/members/${member._id}`,
                                                  {},
                                                  { headers }
                                                );
                                                toast(
                                                  "Removed from group successfully!",
                                                  { type: "success" }
                                                  );
                                                console.log(
                                                  `deleted successfully.`
                                                );
                                            } catch (error) {
                                              console.error(
                                                `Error deleting`,
                                                error
                                              );
                                            }
                                            setTimeout(() => {
                                              window.location.reload()
                                            }, 1_200);
                                          }}>
                                            <i className="fa-solid fa-x"></i>
                                          </button>
                                        )}
                                      </div>
                                    </li>
                                  );
                                }
                              })}
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
