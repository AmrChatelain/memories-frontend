import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function PasswordInput({ value, onChange, placeHolder }) {
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <div className="password-wrapper">
      <input
        type={isShowPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeHolder || "Password"}
      />

      <span
        className="eye-icon"
        onClick={() => setIsShowPassword(!isShowPassword)}
      >
        {isShowPassword ? <FaRegEye /> : <FaRegEyeSlash />}
      </span>
    </div>
  );
}

export default PasswordInput;
