import * as React from "react";
import Header from "../../components/Header/Header";
import WalletActivity from "../../components/Wallet/WalletActivity";
import WalletAssets from "../../components/Wallet/WalletAssets";
import Wallet from "../../components/Wallet/Wallet";

export interface IWalletHomeProps {}

export default function WalletHome(props: IWalletHomeProps) {
  const [showAssets, setShowAssets] = React.useState(true);
  return (
    <div className="artboard phone-3 p-5 mb-5 pb-5">
      <Header />
      <br />
      <div className="flex flex-col w-full h-auto p-4 bg-white rounded-lg shadow-lg">
        <Wallet />
        <br />
        <div className="flex justify-between mb-4">
          <button
            className={`px-4 py-2 rounded-md ${
              showAssets
                ? "shadow-lg bg-zinc-700 text-white"
                : "bg-gray-200 text-gray-700 shadow-lg"
            }`}
            onClick={() => setShowAssets(true)}
          >
            Assets
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              !showAssets
                ? "shadow-lg bg-zinc-700 text-white"
                : "bg-gray-200 text-gray-700 shadow-lg"
            }`}
            onClick={() => setShowAssets(false)}
          >
            Activity
          </button>
        </div>
        {showAssets ? <WalletAssets /> : <WalletActivity />}
      </div>
    </div>
  );
}
