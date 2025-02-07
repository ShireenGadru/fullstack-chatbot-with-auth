import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing/Landing";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { Chat } from "./pages/chat/Chat";
import { VerifyEmail } from "./pages/auth/VerifyEmail";
import { UpdateImage } from "./pages/auth/UpdateImage";
import { getUserData } from "./api/userAuth";
import { useDispatch } from "react-redux";
import {
  isUserLoggedIn,
  resetUserdata,
  setLoggedInUser,
} from "./redux/userSlice";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserData();
      if (response?.success) {
        dispatch(setLoggedInUser(response?.data));
        dispatch(isUserLoggedIn(true));
      } else {
        dispatch(resetUserdata());
        dispatch(isUserLoggedIn(false));
      }
    };

    fetchData();
  }, []);
  return (
    <div className="w-screen  h-screen bg-[url('/assets/bg2.png')] bg-no-repeat bg-cover bg-right text-white flex flex-col ">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/change-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/update-image" element={<UpdateImage />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
};

export default App;
