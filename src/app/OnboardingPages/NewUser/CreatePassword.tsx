import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export interface ICreatePasswordProps {}

export default function CreatePassword(props: ICreatePasswordProps) {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState(true);

  const handleSubmit = () => {
    if (
      newPassword === confirmPassword &&
      newPassword !== "" &&
      newPassword.length >= 6
    ) {
      setError("");
      navigate("/Signature");
    } else if (newPassword.length < 6) {
      setError("Password has to be at least 6 characters long");
    } else {
      setError("Passwords are not matching");
    }
  };
  return (
    <div className="artboard phone-1 p-5">
      <h1 className="text-5xl text-left mb-2">CREATE YOUR PASSWORD</h1>
      <h1
        className={`text-lg text-left mb-3.5 ${
          error !== "" ? "text-red-500" : ""
        }`}
      >
        {error !== "" ? `${error}` : `You will use this to unlock your wallet`}
      </h1>
      <div>
        <h2 className="text-xl text-left mt-3 mb-1">New Password</h2>
        <input
          type="password"
          placeholder="New Password"
          className="input input-bordered w-full"
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
        />
      </div>
      <br />
      <div>
        <h2 className="text-xl text-left mb-1">Confirm Password</h2>
        <input
          type="password"
          placeholder="Confirm Password"
          className="input input-bordered w-full"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        />
      </div>

      <div className="divider"></div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">
            I agree to the{" "}
            <span className="text-lime-700">Terms of Service</span>
          </span>
          <input
            type="checkbox"
            defaultChecked
            className="checkbox"
            onChange={() => {
              setTermsAndConditions(!termsAndConditions);
            }}
          />
        </label>
      </div>

      {/* <Link to="/Signature"> */}
      {termsAndConditions ? (
        <button className="btn btn-wide" onClick={handleSubmit}>
          Confirm
        </button>
      ) : (
        <button className="btn btn-wide" disabled>
          Confirm
        </button>
      )}

      {/* </Link>/ */}
    </div>
  );
}
