// axios instance for making HTTP client requests(GET, POST, DELETE, etc) to the backend API...
import axios from "axios";

// base configuration for integrating the frontend with the backend...
const api = axios.create({
  baseURL: "https://localhost:7276",
});

export default api;