import { useNavigate } from "react-router-dom";
import useFetch from "./../Hooks/useFetch";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { localTokenKey } from "../constants";
import { toast } from "react-toastify";

const MainPage = () => {
    const navigate = useNavigate();
    // const dispatch = useDispatch();
    const { data: users, isLoading } = useFetch("/auth");
    // console.log(users);

    const handleCopyUsername = async () => {

        try {
          await navigator.clipboard.writeText(users.username);
          toast("Username copied successfully", { type: "success" });
        } catch (error) {
          console.error('Error copying username:', error);
        }
      };

      const handleDelete = async () => {
        try {
    
          await axios.delete('/users', {
            headers: {
              'Authorization': `Bearer ${localTokenKey}`,
            },
          });

          toast("Account deleted successfully", { type: "success" });
          localStorage.clear(localTokenKey)
          navigate('/login');
          console.log('Account deleted successfully');
        } catch (error) {
          console.error('Error deleting account:', error.message);
        }
      };

    return (
        <main className="p-3 pb-0 overflow-hidden rounded-to-5 d-flex flex-column">
            {isLoading ? (
                <Spinner />
            ) : (
                users && (
                    <section className="bg-white p-4 py-3 rounded-5">
                        <div className="d-flex justify-content-between align-items-center">
                            <h1>Your Profile</h1>
                            <div className="d-flex gap-1">
                                <button className="btn btn-primary" onClick={handleCopyUsername}>
                                    <i className="fa-solid fa-copy"></i> Copy
                                    Username
                                </button>
                                <button className="btn btn-danger" onClick={handleDelete}>
                                    <i className="fa-solid fa-trash"></i> Delete
                                    Account
                                </button>
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col-lg-2">
                                <div className="display-1 profile-avatar border border-3 text-bg-danger rounded-circle w-100 d-flex align-items-center justify-content-center">
                                    {users.username.slice(0, 1)}
                                </div>
                            </div>
                            <div className="col-lg-10">
                                <h2 className="text-capitalize d-flex align-items-start gap-3">
                                    {users.name}
                                    <span className="fs-6 badge bg-success">
                                        {users.status}
                                    </span>
                                </h2>
                                <p className="text-secondary">
                                    {users.username}
                                </p>
                            </div>
                        </div>
                    </section>
                )
            )}
        </main>
    );
};

export default MainPage;
