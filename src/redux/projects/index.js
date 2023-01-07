import { combineReducers } from "@reduxjs/toolkit";
import projectSlice from "./projectSlice";

export default combineReducers({
  project: projectSlice,
});
