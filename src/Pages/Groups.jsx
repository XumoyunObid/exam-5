import { Link, useNavigate, useParams } from "react-router-dom";
import useFetch from "./../Hooks/useFetch";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { localTokenKey } from "../constants";
import { useSelector } from "react-redux";

const Groups = () => {
  const { data: groups, isLoading } = useFetch("/groups");
    // console.log(groups);

    const { groupId } = useParams();
    const groupss = useSelector((store) => store.group.groupss);
    console.log(groupss);
    const group = groupss?.map((g) => {
        if (g._id === groupId) {
            return g;
        }
    });

  return (
    <div>
      {isLoading ? (
                <Spinner />
            ) : (
                groups && (
                    <div className="container">
                       {groups.map((group) => {
                                    if ( group._id === groupId) {
                                      return (
                                        <div key={group._id}>
                                            <h1
                                                className="text-decoration-none text-light text-start"
                                                to={`/main/groups`}
                                            >
                                                {group.name}
                                            </h1>
                                        </div>
                                    );
                                    }
                                })}
                    </div>
                )
            )}
    </div>
  )
}

export default Groups
