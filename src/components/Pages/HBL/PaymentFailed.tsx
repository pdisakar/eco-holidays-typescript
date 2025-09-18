"use client";
import { useEffect } from "react";
import Breadcrumb from "../../Breadcrumb";
import { PRODUCTION_SERVER, SITE_KEY } from "@/lib/constants";

// Define the component's props interface
interface PaymentFailedProps {
  order_id: string; // Assuming order_id is a string
}

// Define the shape of the data payload for the API call
interface PaymentData {
  order_id: string;
  payment_status: "DECLINED";
}

export default function PaymentFailed({ order_id }: PaymentFailedProps) {
  const invoiceProcessed = async () => {
    // Define the data to be sent, explicitly typed
    const data: PaymentData = {
      order_id,
      payment_status: "DECLINED",
    };

    try {
      // Use the native fetch API to make the POST request
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Payment status updated successfully:", result);

    } catch (error) {
      console.error("Failed to process payment failure:", error);
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
              <h1>Payment Failed!</h1>
            </div>
            <Breadcrumb currentPage="Payment Failed" />
          </div>
          <article className="common-module">
            <div className="alert warning">
              <b>Transaction Failed Sorry!</b>
            </div>
            <p>We could not process your transaction. Below are possible reasons of failure.</p>
            <ul>
              <li>You might have entered wrong card number, expiry date or CVV code.</li>
              <li>You might have entered wrong OTP / Verification code.</li>
              <li>Your card issuing bank declined the card processing. Please ask your bank to enable &ldquo;Online Transaction&rdquo; in your card.</li>
            </ul>
            <p>If you think everything is fine then please try again.</p>
          </article>
        </div>
      </div>
    </>
  );
}