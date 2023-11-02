import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const baseUrl = axios.create({
  baseURL: "https://car-doctor-server-lac-five.vercel.app",
  withCredentials: true,
});

const useAxiosBaseUrl = () => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    baseUrl.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.log("Error response from interceptor", error.response);
        if (error.response.status === 401 || error.response.status === 403) {
          console.log("Log out user");
          logOut()
            .then(() => {
              navigate("/login");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    );
  }, [logOut]);

  return baseUrl;
};

export default useAxiosBaseUrl;
