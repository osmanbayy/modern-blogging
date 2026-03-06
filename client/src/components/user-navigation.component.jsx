import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const UserNavigationPanel = () => {
  const {
    userAuth: { username },
    setUserAuth,
  } = useContext(UserContext);

  const signOutUser = () => {
    removeFromSession("user");
    setUserAuth({ access_token: null });
  };

  return (
    <AnimationWrapper
      transition={{ duration: 0.2 }}
      className="absolute right-0 z-50"
    >
      <div className="absolute right-0 overflow-hidden duration-200 bg-white border border-grey w-60">
        <Link
          to={"/editor"}
          className="flex gap-2 py-4 pl-8 link md:hidden hover:tracking-wide"
        >
          <i className="fi fi-rr-edit"></i>
          <p>Write</p>
        </Link>

        <Link
          to={`/user/${username}`}
          className="flex gap-2 py-4 pl-8 link hover:tracking-wide"
        >
          <i className="fi fi-rr-user"></i>
          Profile
        </Link>

        <Link
          to={"/dashboard/blogs"}
          className="flex gap-2 py-4 pl-8 link hover:tracking-wide"
        >
          <i className="fi fi-rr-apps"></i>
          Dashboard
        </Link>

        <Link
          to={"/settings/edit-profile"}
          className="flex gap-2 py-4 pl-8 link hover:tracking-wide"
        >
          <i className="fi fi-rr-settings"></i>
          Settings
        </Link>

        <span className="absolute w-[150%] -ml-6 border-t border-grey" />

        <button
          onClick={signOutUser}
          className="flex w-full gap-2 py-4 pl-8 hover:bg-grey hover:tracking-wide"
        >
          <i className="fi fi-rr-exit"></i>
          <h1 className="font-bold">Sign Out</h1>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPanel;
