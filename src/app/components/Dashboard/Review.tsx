import * as React from "react";

export interface IReviewProps {}

export default function Review(props: IReviewProps) {
  return (
    <div className="grid flex-grow">
      <label
        htmlFor="my-modal-6"
        className="btn px-4 py-2 rounded-md shadow-lg bg-zinc-700 text-white"
      >
        Reviews
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
          <h3 className="font-bold text-3xl mt-5">Reviews</h3>
          {/*Dynamic Reviews*/}
        </div>
      </div>
    </div>
  );
}
