import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "./../Hooks/useFetch";
import axios from "axios";
import { toast } from "react-toastify";
import { localTokenKey, reqTokenHederKey } from "../constants";

const GroupItemList = () => {
  const { data: groups, isLoading } = useFetch("/groups");
  const { groupId } = useParams();
  const { data: user } = useFetch("/auth");

  function createdItemDate(date) {
    const timestamp = date;
    const dateObject = new Date(timestamp);

    const timeString = dateObject.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const dateString = dateObject.toLocaleDateString("en-GB");

    const time = timeString;
    const dateTime = dateString;
    return `${time},${dateTime}`;
  }

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // This effect will run when items state is updated
    console.log("Items updated:", items);
  }, [items]);

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
      setTitle(""); // Clear the title after successful creation
    }
  };

  const handleBuyItem = async (itemId) => {
    try {
      const headers = {
        Authorization: `Bearer ${localTokenKey}`,
      };
      await axios.post(`/items/${itemId}/mark-as-bought`, {}, { headers });

      toast("Item is marked as bought successfully!", { type: "success" });
      console.log(`Item with ID ${itemId} marked as bought successfully.`);

      // Update the items state
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, boughtBy: user, boughtAt: new Date() } : item
        )
      );
    } catch (error) {
      console.error(`Error marking item with ID ${itemId} as bought:`, error);
    }
  };

  const handleUnbuyItem = async (itemId) => {
    try {
      const headers = {
        Authorization: `Bearer ${localTokenKey}`,
      };
      await axios.delete(`/items/${itemId}/mark-as-bought`, {}, { headers });

      toast("Item is marked as not bought successfully!", { type: "success" });
      console.log(`Item with ID ${itemId} marked as not bought successfully.`);

      // Update the items state
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, boughtBy: null, boughtAt: null } : item
        )
      );
    } catch (error) {
      console.error(`Error marking item with ID ${itemId} as not bought:`, error);
    }
  };

  const handleItemDelete = async (itemId) => {
    try {
      const headers = {
        Authorization: `Bearer ${localTokenKey}`,
      };
      await axios.delete(`/items/${itemId}`, {}, { headers });
      toast("Item is deleted successfully!", { type: "success" });
      console.log(`Item with ID ${itemId} deleted successfully.`);

      // Update the items state
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error(`Error deleting item with ID ${itemId}:`, error);
    }
  };

  return (
    <>
      {isLoading ? (
        "..."
      ) : (
        groups && (
          <>
            {groups.map((group) => {
              if (group._id === groupId) {
                return (
                  <div key={crypto.randomUUID()} className="col-xl-6 h-100 overflow-hidden d-flex flex-column">
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
                          {group.items.map((item) => (
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
                                      Bought by {item.boughtBy.name} {createdItemDate(item.boughtAt)}
                                    </span>
                                  ) : null}
                                  <br />
                                  <span className="text-secondary">
                                    Created by {item.owner.name} ({createdItemDate(item.createdAt)})
                                  </span>
                                </div>
                              </div>
                              <div className="d-flex gap-1">
                                {!item?.boughtBy && (
                                  <button
                                    className="btn btn-success"
                                    onClick={() => handleBuyItem(item._id)}
                                  >
                                    <i className="fa-solid fa-cart-plus"></i>
                                  </button>
                                )}
                                {item?.boughtBy && (
                                  <button
                                    className="btn btn-warning"
                                    onClick={() => handleUnbuyItem(item._id)}
                                  >
                                    <i className="fa-solid fa-shop-slash"></i>
                                  </button>
                                )}
                                {item.owner._id === user._id && (
                                  <button
                                    className="btn btn-danger"
                                    onClick={() => handleItemDelete(item._id)}
                                  >
                                    <i className="fa-solid fa-x"></i>
                                  </button>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </>
        )
      )}
    </>
  );
};

export default GroupItemList;
