import React ,{useState ,useEffect} from 'react'
import { useUser } from "../context/user.context.jsx";
import { useNavigate } from "react-router-dom";


const UserAuth = ({children}) => {


    const { user } = useUser();
    const [loading , setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(()=>{
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token) {
            // If no token, redirect to login immediately
            setLoading(false);
            navigate("/login");
          } else if (!user) {
            // Wait for the user to be restored in the context
            setLoading(true);
          } else {
            // If user is present, stop loading
            setLoading(false);
          }

        

    },[])
    if(loading){
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        )
    }
  return (
   <>{children}</>
  )
}

export default UserAuth
