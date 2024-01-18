import { useParams } from "react-router-dom";
import useFetch from "./../Hooks/useFetch";
import { Spinner, Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { localTokenKey } from "../constants";

const GroupMemberList = () => {
  const { data: groups, isLoading } = useFetch("/groups");
  const { groupId } = useParams();
  const { data: user } = useFetch("/auth");

  const [showModal, setShowModal] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    if (groups) {
      const currentGroup = groups.find((group) => group._id === groupId);
      if (currentGroup) {
        setGroupMembers(currentGroup.members);
      }
    }
  }, [groups, groupId]);

  const handleMemberDelete = async (memberId) => {
    try {
      const headers = {
        Authorization: `Bearer ${localTokenKey}`,
      };
      await axios.delete(`/groups/${groupId}/members/${memberId}`, { headers });
      toast("Removed from group successfully!", { type: "success" });
      console.log(`Deleted successfully.`);

      setGroupMembers((prevMembers) =>
        prevMembers.filter((member) => member._id !== memberId)
      );
    } catch (error) {
      console.error(`Error deleting`, error);
    }
  };

  return (
    <>
      {isLoading
        ? "..."
        : groups && (
            <>
              {groups.map((group) => {
                if (group._id === groupId) {
                  return (
                    <div
                      key={crypto.randomUUID()}
                      className="col-xl-6 h-100 overflow-hidden d-flex flex-column"
                    >
                      <div className="p-3 bg-white rounded-3 d-flex flex-column gap-1 h-100">
                        <div className="d-flex justify-content-between">
                          <h4>
                            Members{" "}
                            <span className="badge bg-primary">
                              {groupMembers.length}
                            </span>
                          </h4>
                        </div>
                        <div className="h-100 overflow-auto members">
                          <ul className="list-group">
                            {groupMembers.map((member) => (
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
                                    <button
                                      className="btn btn-danger"
                                      onClick={() => handleMemberDelete(member._id)}
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
                return null;
              })}
            </>
          )}
      <Modal size="lg" show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className=" w-100">
            <input
              type="text"
              placeholder="Search Member"
              className="w-100 form-control"
            />
          </form>
          <ul>
            <li></li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GroupMemberList;
