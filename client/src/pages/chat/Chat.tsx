import { Logo } from "../../components/Logo";
import userImage from "../../assets/user.png";
import expandIcon from "../../assets/more.png";
import newChat from "../../assets/post.png";
import recentIcon from "../../assets/history.png";
import { useContext, useState } from "react";
import { ChatContext } from "../../context/context";
import { WelcomePage } from "./WelcomePage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { isUserLoggedIn, resetUserdata } from "../../redux/userSlice";

export const Chat = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [expandUser, setExpandUser] = useState(false);
  const {
    setResult,

    setShowResult,
  } = useContext(ChatContext);

  const handleNewChat = () => {
    setShowResult(false);
    setResult("");
  };
  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector((state: RootState) => state.user.userData);
  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        "http://localhost:3000/api/users/logout"
      );
      if (data?.success) {
        dispatch(resetUserdata());
        dispatch(isUserLoggedIn(false));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-center items-center gap-3 w-full h-full p-7">
      {/* left section */}
      <div
        className={`${
          showSidebar ? "w-[300px]" : "w-[90px]"
        } min-h-full rounded-2xl p-4 bg-[#0D0F10]/50 backdrop-blur-md border-2 border-white/10`}
      >
        <img
          src={expandIcon}
          alt=""
          className="w-7 h-7 invert cursor-pointer m-2"
          onClick={toggleSidebar}
        />
        {showSidebar && (
          <div className="w-full flex justify-center items-center my-7">
            <button
              className="cursor-pointer bg-[#131619] rounded-full px-7 py-4 flex gap-3 justify-center items-center hover:bg-[#111212] transition duration-200"
              onClick={handleNewChat}
            >
              {" "}
              <img
                src={newChat}
                alt=""
                className="w-6 h-6 invert cursor-pointer "
              />
              New chat
            </button>
          </div>
        )}
        <br />
        {showSidebar && (
          <div className="flex gap-4 items-center">
            <img
              src={recentIcon}
              className="w-6 h-6 invert cursor-pointer "
              alt=""
            />
            <p className="text-lg"> Recent chats</p>
          </div>
        )}
      </div>

      {/* main chat section */}
      <div className="w-full h-full flex flex-col ">
        {/* logo and user */}

        <div className="flex justify-between  mx-4">
          <Logo />
          <div className="flex gap-4 cursor-pointer">
            {userData?.name ?? "Guest user"}
            <img
              src={userData?.profileImage ?? userImage}
              alt="profileImage"
              className="w-8 h-8 rounded-full"
              onClick={() => setExpandUser((prev) => !prev)}
            />
          </div>
        </div>
        {/* user dropdown */}
        {expandUser && (
          <div className="bg-gray-100 text-gray-800 absolute top-16 right-10 w-[200px] z-10 rounded-lg">
            <ul>
              <Link to={"/verify-email"}>
                <li className="py-2 px-3 my-1 mx-2 hover:bg-gray-300 rounded-md cursor-pointer ">
                  Verify Email
                </li>
              </Link>
              <Link to={"/change-password"}>
                <li className="py-2 px-3 my-1 mx-2 hover:bg-gray-300 rounded-md cursor-pointer ">
                  Change Password
                </li>
              </Link>

              <Link to={"/update-image"}>
                <li className="py-2 px-3 my-1 mx-2 hover:bg-gray-300 rounded-md cursor-pointer ">
                  Change Image
                </li>
              </Link>

              <li
                className="py-2 px-3 my-1 mx-2 hover:bg-gray-300 rounded-md cursor-pointer "
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}

        {/* chat area */}
        <div className="w-full  flex-col flex-grow rounded-2xl min-h-0 p-4 px-[100px] bg-[#0D0F10]/50 backdrop-blur-md  border-2 border-white/10 justify-center items-center flex mt-7">
          <WelcomePage />
        </div>
      </div>
    </div>
  );
};
