/* eslint-disable react/prop-types */
import Image from "../assets/paytm.png";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Appbar = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex flex-row items-center justify-center h-full ml-8">
        <img className="w-[40px]" src={Image} alt="icon" />
        <span> Mini PayTM</span>
      </div>
      <div className="flex items-center pr-4">
        <div className="flex flex-col justify-center h-full mr-4">
          Hello {user}
        </div>
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {user[0]}
          </div>
        </div>
        <div className="w-[200px]">
          <Button
            label={"Log Out"}
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              navigate("/");
              toast.info("You're successufully Logged out!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};
