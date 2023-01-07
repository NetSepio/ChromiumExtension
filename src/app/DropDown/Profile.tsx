import * as React from "react";
import { FaCopy } from "react-icons/fa";
import Header from "../components/Header/Header";

export interface IProfileProps {}

export default function Profile(props: IProfileProps) {
  const walletAddress = "0x3973D017B0Beb0ab7decFC145B522b975e6B76C1";
  const truncatedAddress = `${walletAddress.substring(
    0,
    5
  )}...${walletAddress.substring(walletAddress.length - 4)}`;

  const handleCopyClick = () => {
    navigator.clipboard.writeText(walletAddress);
  };
  return (
    <div className="artboard phone-3 p-5 mb-5 pb-5">
      <Header />
      <br />
      <div className="w-auto bg-base-100 rounded-lg shadow-xl p-5">
        <div className="flex flex-col mb-4">
          <img
            src="./matic-token.png"
            alt="MATIC token"
            className="h-16 w-16 flex items-center mx-32	 mb-4"
          />
          <div className="flex justify-center">
            <span className="text-4xl text-center">User Name</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center mb-4">
            <h1 className="font-bold text-black text-lg">{truncatedAddress}</h1>
            <button
              className="ml-1 px-4 py-2 rounded-lg bg-zinc-700 text-white w-auto h-auto content-around"
              onClick={handleCopyClick}
            >
              <FaCopy />
            </button>
          </div>
        </div>

        {/*Something*/}
        <p className="text-md mt-3 mb-3">Something</p>
        <p className="input input-bordered input-md w-full max-w-xs text-left justify-center">
          Something
        </p>
        {/*Karma Points*/}
        <p className="text-md mt-3 mb-3">Karma Points</p>
        <p className="input input-bordered input-md w-full max-w-xs text-left justify-center">
          Karma Points
        </p>
        {/*Status*/}
        <p className="text-md mt-3 mb-3">Status</p>
        <p className="input input-bordered input-md w-full max-w-xs text-left justify-center">
          Safe
        </p>
      </div>
    </div>
  );
}
