import { configureStore } from "@reduxjs/toolkit";
import groupReducer from './Slices/group';
// import itemReducer from "./Slices/item";

const store = configureStore({
  reducer: {
    group: groupReducer,
    // item: itemReducer,
  },
});

export default store;