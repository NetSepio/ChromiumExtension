import axios from "axios";
import { BASE_URL } from "./config";
import { store } from "../../redux/store";

let accessToken = "";

const listener = () => {
  let state = store.getState();
  const { flow } = state.project;
  axios.defaults.headers.common["Authorization"] = `${flow?.token}`;
  accessToken = flow?.token;
};
store.subscribe(listener);

export class ApiHelper {
  async get(uri, headers) {
    const response = await axios.get(uri, {
      headers,
    });
    return response;
  }
  async post(uri, data) {
    const response = await axios.post(uri, data, {
      headers: {},
    });
    return response;
  }
  async delete(uri) {
    const response = await axios.delete(uri, {
      headers: {},
    });
    return response;
  }
  async put(uri, data, headers) {
    const response = await axios.put(uri, data, {
      headers: {
        ...headers,
      },
    });
    return response;
  }
}
