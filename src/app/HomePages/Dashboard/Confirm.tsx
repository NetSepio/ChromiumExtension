import * as React from "react";
import { Link } from "react-router-dom";

export interface IConfirmProps {}

export default function Confirm(props: IConfirmProps) {
  return (
    <div className="artboard phone-1 p-5">
      <h1 className="text-5xl text-left mb-2">Confirm REQUEST!</h1>
      <br />
      <br />
      <h2 className="text-3xl text-left">You are signing</h2>
      <br />
      <br />
      <h2 className="text-xl text-left">Message</h2>
      <br />
      <p className="text-lg text-left">
        ZenMate Free VPN is the best free VPN Chrome extension to hide your IP,
        Fast & Anonymous VPN. Free Download with 80+ VPN locations. 12343:324352
      </p>
      <br />
      <br />
      <div className="flex w-full mt-2">
        <div className="grid flex-grow">
          <Link to="/">
            <button className="btn mt-5">CANCEL</button>
          </Link>
        </div>

        <div className="divider divider-horizontal"></div>

        <div className="grid flex-grow">
          <Link to="/DashboardHome">
            <button className="btn mt-5">SAVE</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
