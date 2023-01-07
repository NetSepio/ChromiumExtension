import * as React from "react";
import { useNavigate } from "react-router-dom";

export interface ILogoutProps {}

export default function Logout(props: ILogoutProps) {
  const navigate = useNavigate();

  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = () => {
    if (password.length >= 6) {
      setError("");
      navigate("/DashboardHome");
    } else {
      setError("Enter a valid password");
    }
  };

  return (
    <div className="artboard phone-3 p-5">
      <h1 className="text-5xl text-left">Wallet is locked!</h1>
      <p className="text-md mt-5 mb-3">Enter Password</p>
      <p className="text-md mt-5 mb-3 text-red-500">{error}</p>
      <input
        type="password"
        placeholder="Enter Password"
        className="input input-bordered input-md w-full max-w-xs"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn mt-5" onClick={handleSubmit}>
        Unlock
      </button>
    </div>
  );
}
