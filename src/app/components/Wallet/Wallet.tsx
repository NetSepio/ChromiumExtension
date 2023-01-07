import * as React from "react";
import { FaCopy } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { AiOutlineSend } from "react-icons/ai";
import { FaExchangeAlt } from "react-icons/fa";

export interface IWalletProps {}

export default function Wallet(props: IWalletProps) {
  const walletBalance = "1.2345";
  const walletAddress = "0x3973D017B0Beb0ab7decFC145B522b975e6B76C1";
  const truncatedAddress = `${walletAddress.substring(
    0,
    5
  )}...${walletAddress.substring(walletAddress.length - 4)}`;

  const handleCopyClick = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  return (
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

      <div className="flex flex-col mb-4">
        <img
          src="./matic-token.png"
          alt="MATIC token"
          className="h-16 w-16 flex items-center mx-28	 mb-4"
        />
        <div className="flex justify-center">
          <span className="text-4xl text-center">{walletBalance} MATIC</span>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <button className="px-4 py-2 rounded-full shadow-lg bg-zinc-700 text-white w-auto h-auto mx-0.5 flex items-center">
          <FaDownload className="mr-1" />
          Buy Token
        </button>
        <button className="px-4 py-2 rounded-full shadow-lg bg-zinc-700 text-white mr-0.5 w-auto h-auto mx-0.5 flex items-center">
          <AiOutlineSend className="mr-1" />
          Send Token
        </button>
        <button className="px-4 py-2 rounded-full shadow-lg bg-zinc-700 text-white w-auto h-auto mx-0.5 flex items-center">
          <FaExchangeAlt className="mr-1" />
          Swap Token
        </button>
      </div>
    </div>
  );
}
