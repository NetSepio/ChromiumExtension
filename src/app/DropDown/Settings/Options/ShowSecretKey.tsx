import * as React from "react";
import Header from "../../../components/Header/Header";
import SecretKey from "../../../components/Settings/SecretKey";

export interface IShowSecretKeyProps {}

export default function ShowSecretKey(props: IShowSecretKeyProps) {
  return (
    <div className="artboard phone-3 p-5 mb-5 pb-5">
      <Header />
      <br />
      <h1 className="text-5xl mt-5 mb-10 text-left">Secret Key</h1>
      <p className="text-md mt-5 mb-3">Enter Password</p>
      <input
        type="text"
        placeholder="Old Password"
        className="input input-bordered input-md w-full max-w-xs mb-5"
      />
      <SecretKey />
    </div>
  );
}
