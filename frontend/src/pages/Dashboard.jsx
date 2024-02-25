/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";
import { endpoints } from "../configs/urls";

export const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const user = localStorage.getItem("user");
  console.log(endpoints);
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(endpoints.currentuserbalance, config);
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Error fetching account balance:", error);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div>
      <Appbar user={user} />
      <div className="m-8">
        <Balance value={balance.toFixed(2)} />
        <Users />
      </div>
    </div>
  );
};
