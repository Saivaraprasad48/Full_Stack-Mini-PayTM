/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfile = () => {
  const value = 0;
  const [currentuser, SetCurrentUser] = useState();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [modal, setModal] = useState(false);
  const getUserConfimation = () => {
    setModal((p) => !p);
  };

  const deleteCurrentAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        "http://localhost:5000/api/v1/user/delete",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/signup");
      toast.warning("You're account deleted!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.warning("You're account not deleted!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const renderModal = () => {
    if (modal) {
      return (
        <div className="absolute top-50 left-50 bg-red-200 h-[400px] w-[400px] shadow rounded">
          <div className="flex flex-col justify-center h-[400px] items-center">
            <h1 className="text-center p-5 text-2xl font-bold">
              Are you sure to delete this account permanently?
            </h1>
            <button
              onClick={() => setModal((p) => !p)}
              className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-1 w-1/2 bg-black text-white"
            >
              No way! Go Back
            </button>
            <button
              onClick={() => {
                deleteCurrentAccount();
              }}
              className="justify-center rounded-md text-sm font-medium h-10 mt-4 px-4 w-1/2 bg-red-700 text-white"
            >
              Delete permanently
            </button>
          </div>
        </div>
      );
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/user/user-details",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      SetCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };
  console.log(currentuser);
  useEffect(() => {
    fetchCurrentUser();
  }, [value]);

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-3xl font-bold text-center">Your Information</h2>
            <div className="flex flex-col justify-center h-full text-xl pt-4">
              <h1 className="text-center">
                Name:
                <span className="font-semibold pl-2">
                  {currentuser?.firstName} {currentuser?.lastName}
                </span>
              </h1>
              <h1 className="text-center pt-2">
                Email:
                <span className="font-semibold pl-2">
                  {currentuser?.username}
                </span>
              </h1>
              <h1 className="text-center pt-2">
                Av. Balance:
                <span className="font-semibold pl-2">
                  {currentuser?.balance.toFixed(2)}
                </span>
              </h1>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-1 w-full bg-black text-white"
          >
            Go Back
          </button>
          <button
            onClick={() => {
              getUserConfimation();
            }}
            className="justify-center rounded-md text-sm font-medium h-10 px-4 w-full bg-red-700 text-white"
          >
            Delete Account
          </button>
        </div>
        {renderModal()}
      </div>
    </div>
  );
};

export default UserProfile;
