import { request } from "../utils/request.js";
export const loginApi = (username, password) =>
  request("http://localhost:8080/api/user/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });