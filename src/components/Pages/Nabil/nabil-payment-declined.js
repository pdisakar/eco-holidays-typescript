"use client"
import { useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import axios from "axios";
import { PRODUCTION_SERVER, SITE_KEY } from "@/lib/constants";

export default function PaymentDeclined({ payment_id }) {

  useEffect(() => {
    const invoiceProcessed = async () => {
      try {
        const data = {
          payment_id: payment_id,
          payment_status: "DECLINED",
        };
        await axios.post(`${PRODUCTION_SERVER}/payment/check/nabil`, data, {
          headers: {
            Accept: "application/json",
            sitekey: SITE_KEY,
          },
        });
      } catch (error) {
        console.error("Error processing invoice:", error);
      }
    };
  
    if (payment_id) {
      invoiceProcessed();
    }
  }, [payment_id]);

  return (
    <>
      <div className="container">
        <div className="lg:w-10/12 lg:mx-auto">
          <div className="page-title-area">
            <div className="title mb-0">
              <h1>Payment Declined!</h1>
            </div>
            <Breadcrumb currentPage="Payment Failed" />
          </div>
          <article className="common-module">
            <div className="alert warning">
              <b>Transaction Failed Sorry!</b>
            </div>
            <p>
              We could not process your transaction. Below are possible
              reasons of failure.
            </p>
            <ul>
              <li>
                You might have entered wrong card number, expiry date or CVV
                code.
              </li>
              <li>You might have entered wrong OTP / Verification code.</li>
              <li>
                Your card issuing bank declined the card processing. Please
                ask your bank to enable &ldquo;Online Transaction&rdquo; in
                your card. If you think everything is fine then please try
                again.
              </li>
            </ul>
          </article>
        </div>
      </div>
    </>
  );
}
