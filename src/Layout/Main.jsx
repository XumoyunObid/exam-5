import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import Header from "../Partials/Header";
import Sidebar from "../Partials/Sidebar";
import { setUser } from "../Store/Slices/user";


const MainLayout = () => {
    const dispatch = useDispatch();

  useEffect(() => {
    const queries = [
      axios.get("/users"),
      axios.get("/groups"),
      axios.get("/items"),
    ];

    Promise.all(queries).then(
      ([{ data: usersData }, { data: productsData }, { data: ordersData }]) => {
        dispatch(setUser(usersData));
        setProducts(productsData);
        setOrders(ordersData);
      }
    );
  }, [dispatch]);

  return (
    <div className="bg-light" id="main-layout">
        <Header />
        <Sidebar />
        <Outlet />
    </div>
  )
}

export default MainLayout
