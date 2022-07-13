import React from "react";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import abi from '../../utils/Transaction.json'
import { NODE_URL } from "../../services/helper/config";

const Activity = () => {
  // const {walletAddress,privateKey } = useSelector((state) => state?.project);
  // const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
  // const signer = new ethers.Wallet(privateKey, provider);
  // const contract = new ethers.Contract(walletAddress,abi,signer)

  // console.log(contract)
  return <div>You havent done any transactions</div>;
};

export default Activity;
