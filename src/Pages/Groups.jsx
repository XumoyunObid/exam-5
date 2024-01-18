import { useParams, useNavigate, Navigate } from "react-router-dom";
import useFetch from "./../Hooks/useFetch";
import { Spinner, Modal, Button, Form } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { localTokenKey, reqTokenHederKey } from "../constants";
import GroupItemList from "../Components/GroupItemList";
import GroupMemberList from "../Components/GroupMemberList";

const Groups = () => {
  const { data: groups, isLoading } = useFetch("/groups");
  console.log(groups);
  const { groupId } = useParams();
  const navigate = useNavigate()

  const { data: user } = useFetch("/auth");
  console.log(user);

  // const handleshow = handleShow;



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
                                // onClick={handleShow}
                              >
                                Add Member
                              </button>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              { group.owner._id === user._id ? <button
                                className="btn btn-light w-100 text-start"
                                onClick={async () => {
                                  try {
                                    const headers = {
                                      Authorization: `Bearer ${localTokenKey}`,
                                    };
                                    await axios.delete(
                                      `/groups/${groupId}`,
                                      {},
                                      { headers }
                                    );
                                    navigate(`/main`);
                                    toast(
                                      "Group deleted successfully!",
                                      { type: "success" }
                                    );
                                    console.log(
                                      `successfully.`
                                    );
                                  } catch (error) {
                                    console.error(
                                      `Error `,
                                      error
                                    );
                                  }
                                }}
                              >
                                Delete Group
                              </button> : <button
                                className="btn btn-light w-100 text-start"
                                onClick={async () => {
                                  try {
                                    const headers = {
                                      Authorization: `Bearer ${localTokenKey}`,
                                    };
                                    await axios.post(
                                      `/groups/${groupId}/leave`,
                                      {},
                                      { headers }
                                    );
                                    navigate(`/main`);
                                    toast(
                                      "Left from group successfully!",
                                      { type: "success" }
                                    );
                                    console.log(
                                      `successfully.`
                                    );
                                  } catch (error) {
                                    console.error(
                                      `Error `,
                                      error
                                    );
                                  }
                                }}
                              >
                                Leave Group
                              </button>}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>

                    <div className="row flex-fill overflow-hidden gx-5">
                      <GroupItemList/>
                      <GroupMemberList/>
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
