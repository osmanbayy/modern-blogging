import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";

const BlogEditor = () => {
  const handleUploadBanner = (e) => {
    const image = e.target.files[0];
    console.log(image);
  }
  return (
    <>
      {/* Editor Navbar */}
      <nav className="navbar">
        <Link to={"/"} className="flex-none w-10">
          <img src={logo} alt="logo" />
        </Link>
        <p className="text-black line-clamp-1 max-md:hidden">New Blog</p>

        <div className="flex gap-4 ml-auto">
          <button className="py-2 btn-dark">Publish</button>
          <button className="py-2 btn-light bg-grey">Save Draft</button>
        </div>
      </nav>

      {/* Blog Editor */}
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            {/* Blog Banner */}
            <div className="relative bg-white border-4 aspect-video border-grey hover:opacity-80">
              <label>
                <img src={defaultBanner} alt="banner" className="z-20 cursor-pointer" />
                <input type="file" id="uploadBanner" accept="image/*" hidden onChange={handleUploadBanner} />
              </label>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
