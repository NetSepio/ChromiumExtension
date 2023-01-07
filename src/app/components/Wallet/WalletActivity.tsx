import * as React from "react";

export interface IWalletActivityProps {}

export default function WalletActivity(props: IWalletActivityProps) {
  const transactions = [
    {
      type: "Send",
      asset: "BTC",
      amount: "0.1",
      date: "Jan 1, 2021",
    },
    {
      type: "Receive",
      asset: "ETH",
      amount: "0.5",
      date: "Jan 2, 2021",
    },
  ];
  return (
    <div className="flex flex-col mb-4">
      <label className="text-lg font-bold mb-2">Activity</label>
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Asset</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.date}>
              <td className="px-4 py-2">{transaction.type}</td>
              <td className="px-4 py-2">{transaction.asset}</td>
              <td className="px-4 py-2">{transaction.amount}</td>
              <td className="px-4 py-2">{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
