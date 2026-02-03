import React from "react";
import Logo from "../../assets/life.png";
import ProfileInfo from "./Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";

function Navbar({ userInfo }) {

  const isToken = localStorage.getItem("token");

  const navigate = useNavigate();
  const onLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <img src={Logo} alt="Logo" className="h-9" />

      {isToken && <ProfileInfo userInfo={userInfo} onLogOut={onLogOut} />}
    </div>
  );
}

export default Navbar;
