import { createContext, ReactNode, useState } from "react";

interface IChatContext {
  currentPrompt: string;
  setCurrentPrompt: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  result: string;
  showResult: boolean;
  setResult: React.Dispatch<React.SetStateAction<string>>;
  setShowResult: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChatContext = createContext<IChatContext>({
  currentPrompt: "",
  setCurrentPrompt: () => {}, // Placeholder function
  loading: false,
  result: "",
  showResult: false,
  setResult: () => {},
  setShowResult: () => {},
});

const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [showResult, setShowResult] = useState<boolean>(false);

  const chatContextValue = {
    currentPrompt,
    setCurrentPrompt,
    loading,
    result,
    showResult,
    setResult,
    setShowResult
  };

  return (
    <ChatContext.Provider value={chatContextValue}>
      {children}
    </ChatContext.Provider>
  );
};
export default ChatContextProvider;
