"use client";

import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Configure axios to send credentials with cross-origin requests
axios.defaults.withCredentials = true;

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    isAuthenticated: false,
    token: null,
  });
  const [loading, setLoading] = useState(true); // Add loading state

  // Check authentication status on initial load
  useEffect(() => {
    // Function to fetch the current user
    const fetchCurrentUser = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        );

        if (data.success) {
          console.log(data);
          // Store both user data AND token
          setAuth({
            user: data.user,
            isAuthenticated: true,
            token: data.token, // This line is crucial
          });
        } else {
          setAuth({
            user: null,
            isAuthenticated: false,
            token: null,
          });
        }
      } catch (error) {
        setAuth({
          user: null,
          isAuthenticated: false,
          token: null,
        });
      } finally {
        setLoading(false); // Set loading to false regardless of outcome
      }
    };

    fetchCurrentUser();
  }, []);

  // Helper function to update auth state after login
  const login = (userData) => {
    setAuth({
      user: userData,
      isAuthenticated: true,
      token: userData.token,
    });
  };

  // Helper function to update auth state after logout
  const logout = async () => {
    try {
      // Call logout endpoint to clear the cookie
      const res =await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
      if(res.data.success){
        console.log("Logout successful");
        toast.success(res.data.message || "Logged out successfully");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Update state regardless of API success
      setAuth({
        user: null,
        isAuthenticated: false,
        token: null,
      });
    }
  };

  // if (loading) {
  //   // Centered loading spinner component
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
  //       <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-stone-900 animate-spin"></div>
  //     </div>
  //   );
  // }

  return (
    <AuthContext.Provider value={[auth, setAuth, { login, logout }]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;