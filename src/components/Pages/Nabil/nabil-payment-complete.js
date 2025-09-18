"use client";
import { useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { PRODUCTION_SERVER, SITE_KEY } from "@/lib/constants";
import axios from "axios";

export default function PaymentComplete({ payment_id }) {
  useEffect(() => {
    const invoiceProcessed = async () => {
      try {
        const data = {
          payment_id: payment_id,
          payment_status: "APPROVED",
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
        <div className="lg:w-9/12 lg:mx-auto">
          <div className="page-title-area">
            <div className="title mb-0">
              <h1>Payment Complete</h1>
            </div>
            <Breadcrumb currentPage="Payment Complete" />
          </div>
          <article className="common-module">
            <div className="alert success">
              <b>Payment Completed.</b>
            </div>
            <p>
              Thank you for submitting your payment/deposit. Our team will
              promptly confirm receipt of it.
            </p>

            <p>
              If you have any questions or concerns, please don&apos;t hesitate
              to contact us.
            </p>

            <p>
              Best Regards <br />
              Nepal Hiking Team
            </p>
          </article>
        </div>
      </div>
    </>
  );
}
