import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import ChatContextProvider from "./context/context.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ChatContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChatContextProvider>
    </PersistGate>
  </Provider>
);
