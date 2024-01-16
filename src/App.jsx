import { Route, Routes } from "react-router-dom"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import MainLayout from './Layout/Main';
import Groups from "./Pages/Groups";
import MainPage from "./Pages/MainPage";
import PrivateRoute from './Routes/PrivateRoute';

function App() {

  return (
    <>
    <Routes>
    <Route path="/main" element={<MainLayout />}>
          <Route path="/main/groups" element={<Groups />} />
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
    </Routes>
    </>
  )
}

export default App
