import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isUserLoggedIn, setLoggedInUser } from "../../redux/userSlice";
import { Logo } from "../../components/Logo";
import { loginUser } from "../../api/userAuth";
import { LoginData } from "../../types/auth.types";

export const Login = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const validate = () => {
    let error = false;
    if (
      Object.keys(formData).some(
        (field) => formData[field as keyof LoginData] === ""
      )
    ) {
      setError("All Feilds are required");
      error = true;
    } else {
      setError("");
    }
    return error;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      try {
        const data = await loginUser(formData);

        if (data?.success) {
          dispatch(setLoggedInUser(data?.data?.user));
          dispatch(isUserLoggedIn(true));
          navigate("/chat");
        } else {
          setError("User or password is incorrect");
        }
      } catch (error) {
        setError("User or password is incorrect");
      }
    }
  };

  return (
    <div className="h-full w-full">
      <div className="m-5">
        <Logo />
      </div>

      <div className="flex justify-center flex-col items-center h-full ">
        {" "}
        <div className="w-[460px] flex flex-col items-center justify-center bg-[#AAA9A9]/5 backdrop-blur-xs shadow-2xl  py-[70px] border-2 border-white/10 rounded-3xl">
          <h1 className="text-3xl font-bold mb-4">Login</h1>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col my-4">
              <label>Email</label>
              <input
                type="text"
                placeholder="Enter your email"
                className="w-[360px] border-2 border-white/50  rounded-md py-2 px-4 mt-2"
                value={formData?.email}
                onChange={handleChange}
                name="email"
              />
            </div>

            <div className="flex flex-col my-4">
              <label>Password</label>
              <input
                type="text"
                placeholder="Create password"
                className="w-[360px] border-2 border-white/50  rounded-md py-2 px-4 mt-2"
                value={formData?.password}
                onChange={handleChange}
                name="password"
              />
            </div>
            <div>
              <Link to="/change-password">
                <p className="cursor-pointer font-extralight text-orange-300 text-sm hover:underline">
                  Forgot Password?
                </p>
              </Link>
              <p>{error}</p>
              <button
                className="cursor-pointer w-[360px] mt-6 mb-3  py-1.5 text-white font-semibold rounded-md bg-gradient-to-r from-orange-600 to-pink-600  transition duration-400 hover:bg-gradient-to-r 
        hover:from-orange-400 hover:to-pink-400 text-xl"
                type="submit"
              >
                Login
              </button>
            </div>
            <div className="flex items-center justify-center mt-2">
              Don't have an account?{" "}
              <p className="cursor-pointer ml-1 italic underline font-extralight hover:text-yellow-500">
                {" "}
                Sign Up
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
