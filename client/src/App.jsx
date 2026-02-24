import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="signin" element={<UserAuthForm type={"sign-in"} />} />
          <Route path="signup" element={<UserAuthForm type={"sign-up"} />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
