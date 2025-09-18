"use client";
import { useEffect } from "react";
import Breadcrumb from "../../Breadcrumb";
import { PRODUCTION_SERVER, SITE_KEY } from "@/lib/constants";


interface PaymentCancelledProps {
  order_id: string;
}

interface PaymentData {
  order_id: string;
  payment_status: "CANCELLED";
}

export default function PaymentCancelled({
  order_id,
}: PaymentCancelledProps) {

  const invoiceProcessed = async () => {
    const data: PaymentData = {
      order_id,
      payment_status: "CANCELLED",
    };

    try {
      // Add a generic type to the post method for better type inference
      await fetch<PaymentData>(
        `${PRODUCTION_SERVER}/payment/check/hbl`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            sitekey: SITE_KEY,
          },
          body: JSON.stringify(data),
        }
      );
    } catch (error) {
      console.error("Failed to process payment cancellation:", error);
    }
  };

  useEffect(() => {
    invoiceProcessed();
  }, [order_id]); // It's good practice to include order_id in the dependency array

  return (
    <>
      <div className="container">
        <div className="lg:w-9/12 lg:mx-auto">
          <div className="page-title-area">
            <div className="title mb-0">
              <h1>Payment Cancelled</h1>
            </div>
            <Breadcrumb currentPage="Payment Cancelled" />
          </div>
          <article className="common-module">
            <div className="alert danger">
              Your transaction has been canceled.
            </div>
          </article>
        </div>
      </div>
    </>
  );
}