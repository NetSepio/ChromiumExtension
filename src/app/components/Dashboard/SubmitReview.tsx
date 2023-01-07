import * as React from "react";

export interface ISubmitReviewProps {}

export default function SubmitReview(props: ISubmitReviewProps) {
  return (
    <div className="grid flex-grow">
      <label htmlFor="my-modal" className="btn">
        Submit Review
      </label>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-3xl mt-5">Write your Reviews Here</h3>

          {/*TITLE*/}
          <p className="text-md mt-5 mb-3">TITLE</p>
          <input
            type="text"
            placeholder="TITLE"
            className="input input-bordered input-md w-full max-w-xs"
          />
          {/*DESCRIPTION*/}
          <p className="text-md mt-3 mb-3">DESCRIPTION</p>
          <input
            type="text"
            placeholder="DESCRIPTION"
            className="input input-bordered input-md w-full max-w-xs"
          />
          {/*WEBSITE URL*/}
          <p className="text-md mt-3 mb-3">WEBSITE URL</p>
          <input
            type="text"
            placeholder="WEBSITE URL"
            className="input input-bordered input-md w-full max-w-xs"
          />
          {/*CATEGORY*/}
          <p className="text-md mt-3 mb-3">CATEGORY</p>
          <input
            type="text"
            placeholder="CATEGORY"
            className="input input-bordered input-md w-full max-w-xs"
          />
          {/*SITE TYPE*/}
          <p className="text-md mt-3 mb-3">SITE TYPE</p>
          <input
            type="text"
            placeholder="SITE TYPE"
            className="input input-bordered input-md w-full max-w-xs"
          />
          {/*SITE TAG*/}
          <p className="text-md mt-3 mb-3">SITE TAG</p>
          <input
            type="text"
            placeholder="SITE TAG"
            className="input input-bordered input-md w-full max-w-xs"
          />
          {/*SITE SAFETY*/}
          <p className="text-md mt-3 mb-3">SITE SAFETY</p>
          <input
            type="text"
            placeholder="SITE SAFETY"
            className="input input-bordered input-md w-full max-w-xs"
          />
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn">
              Submit
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
