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
import NotFound from "./Pages/NotFound";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async function () {
      if (localTokenKey) {
        const { data: groupss } = await axios.get(`/groups`);
        dispatch(setGroups(groupss));
      }
    })();
  });

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<MainLayout />}>
          <Route
            path="/main/groups/:groupId"
            element={
              <PrivateRoute>
                <Groups />
              </PrivateRoute>
            }
          />
          <Route
            path="/main"
            element={
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
