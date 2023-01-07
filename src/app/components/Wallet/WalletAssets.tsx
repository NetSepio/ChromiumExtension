import * as React from "react";

export interface IWalletAssetsProps {}

export default function WalletAssets(props: IWalletAssetsProps) {
  const assets = [];
  return (
    <div className="flex flex-col mb-4">
      <label className="text-lg font-bold mb-2">Assets</label>

      {assets.length === 0 ? (
        <div>
          <label
            htmlFor="my-modal-6"
            className="btn px-4 py-2 rounded-md shadow-lg bg-zinc-700 text-white"
          >
            Import Token
          </label>
          <input type="checkbox" id="my-modal-6" className="modal-toggle" />
          <div className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <label
                htmlFor="my-modal-6"
                className="btn btn-sm btn-circle absolute right-2 top-2"
              >
                ✕
              </label>
              <h3 className="font-bold text-3xl mt-5">Add your token</h3>
              {/*Token Contract Address*/}
              <p className="text-md mt-5 mb-3">Token Contract Address</p>
              <input
                type="text"
                placeholder="Token Contract Address"
                className="input input-bordered input-md w-full max-w-xs"
              />
              {/*Token Symbol*/}
              <p className="text-md mt-1 mb-3">Token Symbol</p>
              <input
                type="text"
                placeholder="Token Symbol"
                className="input input-bordered input-md w-full max-w-xs"
              />
              {/*Token Decimal*/}
              <p className="text-md mt-1 mb-3">Token Decimal</p>
              <input
                type="text"
                placeholder="Token Decimal"
                className="input input-bordered input-md w-full max-w-xs"
              />
              <div className="modal-action">
                <label htmlFor="my-modal-6" className="btn">
                  Add Token
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Symbol</th>
              <th className="px-4 py-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.symbol}>
                <td className="px-4 py-2">{asset.name}</td>
                <td className="px-4 py-2">{asset.symbol}</td>
                <td className="px-4 py-2">{asset.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
