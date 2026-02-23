import { useState } from "react";

const InputBox = ({ name, type, id, value, placeholder, icon }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative w-full mb-4">
      <input
        name={name}
        type={
          type == "password" ? (passwordVisible ? "text" : "password") : type
        }
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        className="input-box"
      />

      <i className={`fi ${icon} input-icon`} />

      {type == "password" ? (
        <i
          onClick={() => setPasswordVisible((currentVal) => !currentVal)}
          className={`left-auto cursor-pointer fi fi-rr-eye${passwordVisible ? "-crossed" : ""} input-icon right-4`}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default InputBox;
