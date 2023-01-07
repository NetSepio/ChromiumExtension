import * as React from "react";

export interface IChangePasswordProps {}

export default function ChangePassword(props: IChangePasswordProps) {
  return (
    <div>
      <label htmlFor="my-modal-6" className="text-black text-xl text-center">
        Change Password
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

          {/*Old Password*/}
          <p className="text-md mt-5 mb-3">Old Password</p>
          <input
            type="text"
            placeholder="Old Password"
            className="input input-bordered input-md w-full max-w-xs"
          />
          {/*New Password*/}
          <p className="text-md mt-3 mb-3">New Password</p>
          <input
            type="text"
            placeholder="New Password"
            className="input input-bordered input-md w-full max-w-xs"
          />
          {/*Confirm New Password*/}
          <p className="text-md mt-3 mb-3">Confirm New Password</p>
          <input
            type="text"
            placeholder="Confirm New Password"
            className="input input-bordered input-md w-full max-w-xs"
          />

          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn">
              Change & Save
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
