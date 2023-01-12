import * as React from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

export interface IGetSecretKeyProps {}

export default function GetSecretKey(props: IGetSecretKeyProps) {
  const [showModal, setShowModal] = React.useState(false);
  const [mnemonic, setMnemonic] = React.useState("");
  const [address, setAddress] = React.useState("");

  const generateWallet = async () => {
    let wallet = ethers.Wallet.createRandom();
    let secretPhases = wallet.mnemonic.phrase;
    setMnemonic(secretPhases);
    setAddress(await wallet.getAddress());
  };

  React.useEffect(() => {
    showModal ? generateWallet() : null;
  }, [showModal]);

  return (
    <div className="artboard phone-1 p-5">
      <h1 className="text-5xl text-left mb-60">Get your secret key here</h1>

      <label htmlFor="my-modal" className="btn btn-wide">
        Secret Key
      </label>
      <div className="divider mr-5"></div>
      <Link to="/ImportSecretKey">
        <button className="btn btn-wide float-left">
          Import Wallet Instead
        </button>
      </Link>

      <input
        type="checkbox"
        id="my-modal"
        className="modal-toggle"
        onChange={() => setShowModal(true)}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Secret Recovery Password</h3>
          <br />
          <h3 className="text-sm">
            This is the only way you will be able to recover your account.
            Please store it somewhere safe!
          </h3>
          <p className="py-4 font-bold text-xl">{mnemonic}</p>
          <div className="modal-action">
            <Link to="/CreatePassword">
              <label htmlFor="my-modal" className="btn btn-wide">
                Create Password
              </label>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
