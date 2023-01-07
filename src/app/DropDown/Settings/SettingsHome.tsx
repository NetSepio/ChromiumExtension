import * as React from "react";
import Header from "../../components/Header/Header";
import ChangePassword from "../../components/Settings/ChangePassword";

export interface ISettingsProps {}

export default function Settings(props: ISettingsProps) {
  return (
    <div className="artboard phone-3 p-5 mb-5 pb-5">
      <Header />

      <br />
      <h1 className="text-5xl mt-5 mb-2 text-left">Settings</h1>

      <br />
      <div className="justify-center">
        <div className="block rounded-lg shadow-lg bg-white p-5 w-auto h-auto hover:bg-slate-200 active:bg-slate-500">
          <ChangePassword />
        </div>
      </div>
      <br />

      <br />
      <div className="justify-center">
        <div className="block rounded-lg shadow-lg bg-white p-5 w-auto h-auto hover:bg-slate-200 active:bg-slate-500">
          <a href="#/SettingsHome" className="text-black text-xl text-center">
            Change Network
          </a>
        </div>
      </div>
      <br />

      <br />
      <div className="justify-center">
        <div className="block rounded-lg shadow-lg bg-white p-5 w-auto h-auto hover:bg-slate-200 active:bg-slate-500">
          <a href="#/SettingsHome" className="text-black text-xl text-center">
            Auto Lock
          </a>
        </div>
      </div>
      <br />
      {/*Show Secret Key*/}
      <br />
      <div className="justify-center">
        <div className="block rounded-lg shadow-lg bg-white p-5 w-auto h-auto hover:bg-slate-200 active:bg-slate-500">
          <a href="#/ShowSecretKey" className="text-black text-xl text-center">
            Show Secret Key
          </a>
        </div>
      </div>
      <br />
      {/*Reset Secret Key*/}
      <br />
      <div className="justify-center mb-10">
        <div className="block rounded-lg shadow-lg bg-white p-5 w-auto h-auto hover:bg-slate-200 active:bg-slate-500">
          <a href="#/SettingsHome" className="text-black text-xl text-center">
            Reset Secret Key
          </a>
        </div>
      </div>
      <br />
    </div>
  );
}
