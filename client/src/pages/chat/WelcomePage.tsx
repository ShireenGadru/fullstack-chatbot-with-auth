import React, { useContext } from "react";
import { ChatContext } from "../../context/context";
import run from "../../config/gemini";
import submitIcon from "../../assets/application.png";
import userImage from "../../assets/user.png";
import clemLogo from "../../assets/logo.png";

export const WelcomePage = () => {
  const {
    currentPrompt,
    setCurrentPrompt,
    loading,
    result,
    setResult,
    showResult,
    setShowResult,
  } = useContext(ChatContext);

  const displayResult = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowResult(true);
    console.log("here");
    console.log({ currentPrompt, loading, result, showResult });
    setResult(await run(currentPrompt));
  };

  const WelcomeCN =
    "bg-[#2e2e2e] w-full py-3 rounded-4xl flex justify-center items-center gap-5";
  const chatCN =
    "bg-[#2e2e2e] w-full py-2 rounded-4xl flex justify-center items-center gap-5";

  return (
    <div
      className={`w-full h-full ${
        showResult ? "justify-end" : "justify-center"
      } items-center flex flex-col`}
    >
      {/* welcome heading */}
      {!showResult && (
        <h1 className="text-4xl mb-[70px]">
          {" "}
          Welcome, Shireen! How can I help you today?
        </h1>
      )}

      {/* prmopt */}
      {showResult && (
        <div className="flex flex-col w-full justify-start my-5">
          <div className="flex gap-2 cursor-pointer">
            <img src={userImage} alt="profileImage" className="w-7 h-7" />
            You
          </div>
          <div className="w-fit bg-[#2e2e2e] py-3 px-7 rounded-lg ml-[40px]">
            {currentPrompt}
          </div>
        </div>
      )}

      {/* result  */}
      {result && showResult && (
        <div className="flex flex-col w-full justify-start my-5">
          <div className="flex gap-2 cursor-pointer">
            <img src={clemLogo} alt="profileImage" className="w-7 h-7" />
            Clem
          </div>
          <div className="w-fit bg-[#2e2e2e] py-3 px-7 rounded-lg ml-[40px]">
            {result}
          </div>
        </div>
      )}

      {/* chat input */}
      <form
        onSubmit={displayResult}
        className={showResult ? chatCN : WelcomeCN}
      >
        <input
          type="text"
          placeholder="  Ask anything you want..."
          className={`w-[90%] ${
            showResult ? "py-2" : "py-5"
          }  bg-[#2e2e2e] focus:outline-none text-xl`}
          onChange={(e) => setCurrentPrompt(e.target.value)}
        />
        <button type="submit">
          {" "}
          <img
            src={submitIcon}
            alt=""
            className="w-7 h-7 invert cursor-pointer"
          />
        </button>
      </form>
    </div>
  );
};
