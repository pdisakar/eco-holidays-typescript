import Link from 'next/link';
import type { Metadata } from 'next';

export function metadata(): Metadata {
  return {
    title: 'Payment Success',
  };
}

export default function Page() {
  return (
    <>
      <div className="container common-box text-center">
        <div className="row">
          <div className="col-xl-10 mx-auto">
            <h1>Payment has been successfully processed</h1>
            <article className="common-module">
              <p>
                Hello, your payment at{' '}
                <b className="font-semibold">{process.env.company_name}</b> was successful. We will send you further status updates.
              </p>
            </article>
            <Link href="/" className="btn btn-primary btn-md rounded shadow-md shadow-primary/20">
              Back to Home Page
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}