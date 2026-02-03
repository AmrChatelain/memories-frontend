import React, { useEffect, useState } from "react";
import Navbar from "../../Components/input/Navbar";
import {useNavigate} from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'

function Home() {

  const navigate = useNavigate();

  const [userInfo,setUserInfo]= useState(null);

  // get user Here

  const getUserInfo = async ()=>{
    try{
      const response = await axiosInstance.get("/auth/verify");
      if(response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    }catch(error) {
      if(error.response.status === 401){
        localStorage.clear();
        navigate("login");
      }

    }
  };

  useEffect(() => {
  getUserInfo();
}, []);

  return (
    <>
      <Navbar userInfo={userInfo} />
    </>
  );
}

export default Home;
