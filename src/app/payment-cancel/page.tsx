import { BASE_URL } from "@/lib/constants";
import Link from "next/link";
import type { Metadata } from "next";

export function metadata(): Metadata {
  return {
    title: "Payment Cancelled",
  };
}

export default function Page() {
  return (
    <>
      <div className="container common-box text-center">
        <div className="row">
          <div className="col-xl-10 mx-auto">
            <h1>Payment has been cancelled</h1>
            <article className="common-module">
              <p>
                Your payment at{" "}
                <b className="font-semibold">
                  {process.env.company_name}
                </b>{" "}
                was cancelled.
              </p>
            </article>
            <Link
              href={BASE_URL}
              className="btn btn-primary btn-md rounded shadow-md shadow-primary/20"
            >
              Back to Home Page
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}