import { useRef, useState } from "react";
import { Logo } from "../../components/Logo";
import { useNavigate } from "react-router-dom";
import {
  sendResetPasswordOTP,
  updatePassword,
  verifyResetPasswordOTP,
} from "../../api/userAuth";

type steps = 0 | 1 | 2;

export const ResetPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<steps>(0);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    switch (currentStep) {
      case 0:
        {
          const response = await sendResetPasswordOTP(email);
          if (response?.data?.success) {
            setCurrentStep(1);
          }
        }
        break;
      case 1:
        {
          const otpArray = inputRefs.current.map((input) => input.value);
          const otp = otpArray.join("");
          const response = await verifyResetPasswordOTP(email, otp);
          if (response?.data?.success) {
            setCurrentStep(2);
          }
        }
        break;
      case 2:
        const response = await updatePassword(email, newPassword);
        if (response?.data?.success) {
          console.log("pwd updated");
        }
        break;
    }

    navigate("/login");
  };

  const addRefToInput = (el: HTMLInputElement | null, index: number) => {
    if (el) {
      inputRefs.current[index] = el;
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const target = e.target as HTMLInputElement;
    if (target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const target = e.target as HTMLInputElement;
    if (e.key === "Backspace" && index > 0 && target.value === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };
  return (
    <div className="h-full w-full">
      <div className="m-5">
        <Logo />
      </div>
      <div className="flex justify-center items-center h-full ">
        {" "}
        <div className="w-[460px] flex flex-col items-center justify-center bg-[#AAA9A9]/5 backdrop-blur-xs shadow-2xl  py-[70px] border-2 border-white/10 rounded-3xl">
          <h1 className="text-3xl font-bold mb-4">Change Password</h1>

          <form onSubmit={handleSubmit}>
            {currentStep === 0 && (
              <div className="flex flex-col my-4">
                <label>Email</label>
                <input
                  type="text"
                  placeholder="Enter your email"
                  className="w-[360px] border-2 border-white/50  rounded-md py-2 px-4 mt-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                />
              </div>
            )}

            {currentStep === 1 && (
              <div className="flex  flex-col my-4">
                <label htmlFor="">Enter OTP</label>
                <div className="flex justify-between" onPaste={handlePaste}>
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <input
                        type="text"
                        maxLength={1}
                        key={index}
                        required
                        ref={(el) => addRefToInput(el, index)}
                        onInput={(e) => handleInput(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-12 h-12 border-2 border-white/50 text-white text-center text-xl rounded-md mt-2"
                      />
                    ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col my-4">
                <label>New password</label>
                <input
                  type="text"
                  placeholder="Enter new password"
                  className="w-[360px] border-2 border-white/50  rounded-md py-2 px-4 mt-2"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  name="newPassword"
                />
              </div>
            )}

            <div>
              <button
                className="cursor-pointer w-[360px] mt-6 mb-3  py-1.5 text-white font-semibold rounded-md bg-gradient-to-r from-orange-600 to-pink-600  transition duration-400 hover:bg-gradient-to-r 
        hover:from-orange-400 hover:to-pink-400 text-xl"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
