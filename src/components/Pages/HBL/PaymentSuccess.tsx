"use client";
import { useEffect } from "react";
import Breadcrumb from "../../Breadcrumb";
import { PRODUCTION_SERVER, SITE_KEY } from "@/lib/constants";

// Define the component's props interface
interface PaymentSuccessfulProps {
  order_id: string; // Assuming order_id is a string
}

// Define the shape of the data payload for the API call
interface PaymentData {
  order_id: string;
  payment_status: "APPROVED";
}

export default function PaymentSuccessful({ order_id }: PaymentSuccessfulProps) {
  const invoiceProcessed = async () => {
    // Define the data to be sent, explicitly typed
    const data: PaymentData = {
      order_id,
      payment_status: "APPROVED",
    };

    try {
      // Use the native fetch API for the POST request
      const response = await fetch(`${PRODUCTION_SERVER}/payment/check/hbl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          sitekey: SITE_KEY,
        },
        body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
      });

      if (!response.ok) {
        // Handle HTTP errors, e.g., 404, 500
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Payment status updated successfully:", result);
    } catch (error) {
      console.error("Failed to process payment status:", error);
    }
  };

  useEffect(() => {
    invoiceProcessed();
  }, [order_id]);

  return (
    <>
      <div className="container">
        <div className="lg:w-9/12 lg:mx-auto">
          <div className="page-title-area">
            <div className="title mb-0">
              <h1>Payment Successful!</h1>
            </div>
            <Breadcrumb currentPage="Payment Successful" />
          </div>
          <article className="common-module">
            <div className="alert success">
              <b>Payment Successful.</b>
            </div>
            <p>
              Thank you for submitting your payment/deposit. Our team will
              promptly confirm receipt of it.
            </p>
            <p>
              If you have any questions or concerns, please don&apos;t hesitate to
              contact us.
            </p>
            <p>
              Best Regards <br />
              <b>Nepal Hiking Team</b>
            </p>
          </article>
        </div>
      </div>
    </>
  );
}