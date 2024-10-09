import { ConfigProvider } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/home";
import { Provider } from "react-redux";
import store from "@src/store";
function App() {
  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#FFAB08",
          },
        }}
      >
        {" "}
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Provider>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
