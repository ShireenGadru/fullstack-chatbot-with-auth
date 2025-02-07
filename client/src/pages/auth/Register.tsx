import { useState } from "react";
import { Logo } from "../../components/Logo";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/userAuth";
import successIcon from "../../assets/checked.png";
import { RegisterData } from "../../types/auth.types";

export const Register = () => {
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value.trim(),
      };
    });
  };

  const validate = () => {
    let error = false;
    if (
      Object.keys(formData).some(
        (field) => formData[field as keyof RegisterData] === ""
      )
    ) {
      setError("All Feilds are required");
      error = true;
    } else if (formData?.password.length < 8) {
      setError("Please enter a strong password");
      error = true;
    } else {
      setError("");
    }
    return error;
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      const data = await registerUser(formData);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);

      console.log(data);
    }
  };

  return (
    <div className="h-full w-full">
      <div className="m-5">
        <Logo />
      </div>
      <div className="flex justify-center items-center h-full">
        {" "}
        <div className="w-[460px] flex flex-col items-center justify-center bg-[#AAA9A9]/5 backdrop-blur-xs shadow-2xl  py-[70px] border-2 border-white/10 rounded-3xl">
          {!isSuccess && <h1 className="text-3xl font-bold mb-4">Register</h1>}
          {isSuccess ? (
            <div className="flex items-center justify-center flex-col">
              <img src={successIcon} alt="success" className="w-36 h-36 m-5 " />
              <p className="text-2xl font-semibold">User Registered</p>

              <p className="my-5">Redirecting to Login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col my-4">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-[360px] border-2 border-white/50 rounded-md py-2 px-4 mt-2"
                  value={formData?.name}
                  onChange={handleChange}
                  name="name"
                />
              </div>

              <div className="flex flex-col my-4">
                <label>Email</label>
                <input
                  type="email"
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
                <p>{error}</p>
                <button
                  className="cursor-pointer w-[360px] mt-4 mb-3  py-1.5 text-white font-semibold rounded-md bg-gradient-to-r from-orange-600 to-pink-600  transition duration-400 hover:bg-gradient-to-r 
          hover:from-orange-400 hover:to-pink-400 text-xl"
                  type="submit"
                >
                  Sign Up
                </button>
              </div>
              <div className="flex items-center justify-center mt-2">
                Already have an account?{" "}
                <p className="cursor-pointer ml-1 italic underline font-extralight hover:text-yellow-500">
                  {" "}
                  Login here
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
