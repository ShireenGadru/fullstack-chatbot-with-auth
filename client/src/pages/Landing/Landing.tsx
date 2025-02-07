import { Logo } from "../../components/Logo";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const Landing = () => {
  const isUserLoggedIn = useSelector(
    (state: RootState) => state.user?.isLoggedIn
  );

  return (
    <div className="pt-[30px]  sm:px-[50px] lg:px-[150px]  px-[20px]">
      <div className="m-5 ">
        {" "}
        <Logo />
      </div>

      <section>
        <h1 className="sm:text-6xl text-4xl font-bold mt-[100px] ">
          Welcome to Clem AI
        </h1>
        <p className="italic mt-[35px] text-xl max-w-170">
          Experience the power of AI with Clem—an intelligent chatbot built to
          assist, engage, and enhance your daily tasks with ease.
        </p>
      </section>
      <section className="mt-[100px] flex flex-col gap-4">
        {!isUserLoggedIn && (
          <Link to="/login" className="w-fit">
            {" "}
            <button
              className="cursor-pointer w-74 py-3 text-white font-semibold rounded-[15px] bg-gradient-to-r from-orange-500 to-pink-500 hover:bg-gradient-to-r 
          hover:from-orange-600 hover:to-pink-700 
          transform hover:scale-102 transition-transform duration-500 ease-in-out"
            >
              Login
            </button>
          </Link>
        )}
        {!isUserLoggedIn && (
          <Link to="/register" className="w-fit">
            {" "}
            <button
              className="w-74 py-3 text-white font-semibold rounded-[15px] bg-gradient-to-r from-yellow-500 to-orange-500 cursor-pointer 
        hover:bg-gradient-to-r hover:from-yellow-600 hover:to-orange-600 transform hover:scale-102 transition-transform duration-500 ease-in-out"
            >
              Sign Up
            </button>
          </Link>
        )}

        <Link to="/chat" className="w-fit">
          <button
            className="w-74 py-3 text-white font-semibold rounded-[15px] border-2 border-white bg-[#0D0F10] mt-7 cursor-pointer 
        transform hover:scale-102 transition-transform duration-500 ease-in-out hover:bg-[#282C2F]"
          >
            {isUserLoggedIn ? "Chat with Clem" : " Continue as guest"}
          </button>
        </Link>
      </section>
    </div>
  );
};
