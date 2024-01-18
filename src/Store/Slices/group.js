import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const groupSlice = createSlice({
  name: "group-slice",
  initialState,
  reducers: {
    setGroups(_state, action) {
      return action.payload;
    },
    updateMembers(_state, action) {
      return action.payload
    },
  },
});

const groupReducer = groupSlice.reducer;

export default groupReducer;

export const {
  setGroups,updateMembers,
} = groupSlice.actions;