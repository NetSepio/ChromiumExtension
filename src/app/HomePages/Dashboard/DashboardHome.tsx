import * as React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Header from "../../components/Header/Header";
import Review from "../../components/Dashboard/Review";
import SubmitReview from "../../components/Dashboard/SubmitReview";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ["Genuine", "Scam", "Stereotype", "Hate", "Fake"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 3],
      backgroundColor: [
        "rgb(52,61,70)",
        "rgb(79,91,102)",
        "rgb(101,115,126)",
        "rgb(167,173,186)",
        "rgb(192,197,206)",
      ],
      borderColor: [
        "rgb(52,61,70)",
        "rgb(79,91,102)",
        "rgb(101,115,126)",
        "rgb(167,173,186)",
        "rgb(192,197,206)",
      ],
      borderWidth: 1,
    },
  ],
};

export interface IDashboardHomeProps {}

export default function DashboardHome(props: IDashboardHomeProps) {
  return (
    <div className="artboard phone-3 p-5 mb-5 pb-5">
      <Header />
      <br />

      <div className="flex">
        <div className="flex-1 w-72">
          <div className="justify-center">
            <div className="block rounded-lg shadow-lg bg-white p-5 w-auto h-auto content-around">
              <h1 className="font-bold text-black text-lg">
                http://localhost:8080
              </h1>
            </div>
          </div>
        </div>
        <div className="flex-none">
          <div className="flex justify-center">
            <div className="block rounded-lg shadow-lg bg-zinc-700 p-5 w-auto h-auto content-around">
              <div className="rounded-full shadow-lg w-6 h-auto">
                <p className="font-bold text-white text-lg">0/5</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />
      <div className="justify-center">
        <div className="block rounded-lg shadow-lg bg-white p-5 w-auto h-auto">
          <h1 className="font-bold text-black text-3xl text-center">
            Sounds Genuine
          </h1>
        </div>
      </div>
      <br />

      <div className="shadow-lg rounded-lg overflow-hidden">
        <div className="py-3 px-5 bg-gray-50 text-lg font-bold text-center">
          Chart
        </div>
        <Doughnut data={data} />
      </div>

      <div className="w-auto bg-base-100 shadow-xl rounded-lg">
        <div className="card-body">
          <h2 className="py-3 px-5 bg-gray-50 text-lg font-bold text-center">
            What people say
          </h2>
          <br />
          <div className="flex">
            <div className="flex-none w-28 h-14 font-semibold">Genuine</div>
            <div className="flex-initial w-auto ...">
              <progress
                className="progress w-40"
                value="10"
                max="100"
              ></progress>
            </div>
          </div>

          <div className="flex">
            <div className="flex-none w-28 h-14 font-semibold">Scam</div>
            <div className="flex-initial w-auto ...">
              <progress
                className="progress w-40"
                value="30"
                max="100"
              ></progress>
            </div>
          </div>

          <div className="flex">
            <div className="flex-none w-28 h-14 font-semibold">Stereotype</div>
            <div className="flex-initial w-auto ...">
              <progress
                className="progress w-40"
                value="40"
                max="100"
              ></progress>
            </div>
          </div>

          <div className="flex">
            <div className="flex-none w-28 h-14 font-semibold">Hate</div>
            <div className="flex-initial w-auto ...">
              <progress
                className="progress w-40"
                value="60"
                max="100"
              ></progress>
            </div>
          </div>

          <div className="flex">
            <div className="flex-none w-28 h-14 font-semibold">Fake</div>
            <div className="flex-initial w-auto ...">
              <progress
                className="progress w-40"
                value="80"
                max="100"
              ></progress>
            </div>
          </div>

          <div className="card-actions justify-center">
            <Review />
            <SubmitReview />
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}
