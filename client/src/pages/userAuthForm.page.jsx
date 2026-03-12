import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { useContext } from "react";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  const {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}${serverRoute}`, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response?.data?.message);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const serverRoute = type == "sign-in" ? "/signin" : "/signup";

    const form = new FormData(e.currentTarget);
    const formData = Object.fromEntries(form.entries());

    userAuthThroughServer(serverRoute, formData);
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
  
    try {
  
      const result = await authWithGoogle();
      const idToken = await result.user.getIdToken();
      const serverRoute = "/google-auth";
      const formData = { access_token: idToken };
  
      userAuthThroughServer(serverRoute, formData);
  
    } catch (err) {
      toast.error("Google auth failed");
    }
  };

  return access_token ? (
    <Navigate to={"/"} />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="flex items-center justify-center h-cover">
        <form onSubmit={handleSubmit} className="w-[80%] max-w-[400px]">
          <h1 className="mb-24 text-4xl text-center capitalize font-gelasio">
            {type == "sign-in" ? "Welcome Back" : "Join Us Today"}
          </h1>

          {/* Name Input */}
          {type != "sign-in" ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          ) : (
            <></>
          )}

          {/* Email Input */}
          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />

          {/* Password Input */}
          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />

          {/* Submit Button */}
          <button type="submit" className="btn-dark center mt-14">
            {type.replace("-", " ")}
          </button>

          <div className="relative flex items-center w-full gap-2 my-10 font-bold text-black uppercase opacity-10">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleAuth}
            className="flex items-center justify-center gap-4 btn-dark w-[90%] center"
          >
            <img src={googleIcon} alt="" className="w-5" />
            continue with google
          </button>

          {type == "sign-in" ? (
            <p className="mt-6 text-xl text-center text-dark-grey">
              Don't have an account
              <Link
                to={"/signup"}
                className="ml-1 text-xl text-black underline"
              >
                Join Us Today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-xl text-center text-dark-grey">
              Already a member?
              <Link
                to={"/signin"}
                className="ml-1 text-xl text-black underline"
              >
                Sign In Here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
