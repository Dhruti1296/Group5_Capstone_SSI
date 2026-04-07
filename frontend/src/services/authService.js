import api from "./api";

// sending a login request with the user credentials...
export const login = (data) => api.post("/api/auth/login", data);

// sending registration request to create a new user...
export const register = (data) => api.post("/api/auth/register", data);