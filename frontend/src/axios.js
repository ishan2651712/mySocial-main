import axios from "axios";

const Axios = axios.create({
  baseURL: "http://localhost:8800/api", // this matches your .env
  withCredentials: true,
});

export default Axios;
