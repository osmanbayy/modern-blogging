import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "../imgs/logo.png";

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="logo" className="w-full" />
        </Link>

        {/* Search Box */}
        <div
          className={`absolute left-0 w-full bg-white top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ${searchBoxVisibility ? "show" : "hide"}`}
        >
          <input
            type="text"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            placeholder="Search..."
          />
          <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
        </div>

        <div className="flex items-center gap-3 ml-auto md:gap-6">
          {/* Search Box Trigger */}
          <button
            onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
            className="flex items-center justify-center w-12 h-12 rounded-full md:hidden bg-grey"
          >
            <i className="text-xl fi fi-rr-search"></i>
          </button>

          {/* Create a Blog Button */}
          <Link to={"/editor"} className="hidden gap-2 md:flex link">
            <i className="fi fi-rr-file-edit"></i>
            <p>Write</p>
          </Link>

          {/* Auth Buttons */}
          <Link to={"/signin"} className="py-2 btn-dark">
            Sign In
          </Link>
          <Link to={"/signup"} className="hidden py-2 md:block btn-light">
            Sign Up
          </Link>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
