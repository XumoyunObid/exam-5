import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import MainLayout from "./Layout/Main";
import Groups from "./Pages/Groups";
import MainPage from "./Pages/MainPage";
import PrivateRoute from "./Routes/PrivateRoute";
import { useEffect } from "react";
import { localTokenKey } from "./constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setGroups } from "./Store/Slices/group";


function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    (async function () {
      if (localTokenKey) {
        const { data: groupss } = await axios.get(`/groups`)
        dispatch(setGroups(groupss))
      }
    }) ();
  })
    return (
        <>
            <Routes>
                <Route key="main" path="/main" element={<MainLayout />}>
                    <Route
                        key="groups"
                        path="/main/groups/:groupId"
                        element={
                            <PrivateRoute>
                                <Groups />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        key="mainPage"
                        path="/main"
                        element={
                            <PrivateRoute>
                                <MainPage />
                            </PrivateRoute>
                        }
                    />
                </Route>
                <Route key="login" path="/login" element={<Login />} />
                <Route key="register" path="/register" element={<Register />} />
            </Routes>
        </>
    );
}

export default App;
