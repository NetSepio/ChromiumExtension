import * as React from "react";
import Header from "../components/Header/Header";

export interface IFeedbackProps {}

export default function Feedback(props: IFeedbackProps) {
  return (
    <div className="artboard phone-3 p-5">
      <Header />
      <br />
      <div>
        <h1 className="text-3xl text-left mt-5 mb-5">Rate Us</h1>
        <div className="rating">
          <input
            type="radio"
            name="rating-2"
            className="mask mask-star-2 bg-orange-400"
          />
          <input
            type="radio"
            name="rating-2"
            className="mask mask-star-2 bg-orange-400"
            checked
          />
          <input
            type="radio"
            name="rating-2"
            className="mask mask-star-2 bg-orange-400"
          />
          <input
            type="radio"
            name="rating-2"
            className="mask mask-star-2 bg-orange-400"
          />
          <input
            type="radio"
            name="rating-2"
            className="mask mask-star-2 bg-orange-400"
          />
        </div>
      </div>

      <div>
        <h1 className="text-5xl text-left mt-10 mb-5">Write to Us!</h1>
      </div>

      <textarea
        className="textarea textarea-bordered w-full h-44"
        placeholder="Write Here"
      ></textarea>

      <button className="btn mt-5">Submit</button>
    </div>
  );
}
