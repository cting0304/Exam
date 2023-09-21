import { createContext, useState, useCallback, useEffect } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => { 
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        country: "",
        state: "",
        city: "",
        image: "",
    });
 
    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info);
    }, []);



    const registerUser = useCallback(async (e) => {
        e.preventDefault();
      
        console.log("Register Info:", registerInfo);
      
        setIsRegisterLoading(true);
        setRegisterError(null);
      
        const response = await postRequest(`/users/register`, registerInfo);
        

      
        setIsRegisterLoading(false);
      
        if (response.error) {
          return setRegisterError(response);
        }
      
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    }, [registerInfo]);

      
    return (
        <AuthContext.Provider
            value={{
                user,
                registerInfo,
                updateRegisterInfo,
                registerUser,
                registerError,
                isRegisterLoading,
            }}
        >
            {children}
        </AuthContext.Provider>    
    );
};    