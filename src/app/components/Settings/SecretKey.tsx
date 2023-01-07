import * as React from "react";

export interface ISecretKeyProps {}

export default function SecretKey(props: ISecretKeyProps) {
  return (
    <div>
      <label htmlFor="my-modal" className="btn">
        Submit
      </label>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Secret Recovery Password</h3>
          <br />
          <h3 className="text-sm">
            This is the only way you will be able to recover your account.
            Please store it somewhere safe!
          </h3>
          <p className="py-4 font-bold text-xl">
            afford mansion car rival service elder inflict loop prosper nothing
            luxury gossip
          </p>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn">
              <a href="#/SettingsHome">Close</a>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
