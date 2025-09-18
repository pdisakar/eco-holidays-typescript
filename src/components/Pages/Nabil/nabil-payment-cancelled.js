"use client"
import { useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import axios from "axios";
import { PRODUCTION_SERVER, SITE_KEY } from "@/lib/constants";

export default function  PaymentCancelled({payment_id}) {
  
  useEffect(() => {
    const invoiceProcessed = async () => {
      try {
        const data = {
          payment_id: payment_id,
          payment_status: "CANCELLED",
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
        <div className="row">
          <div className="col-lg-10 mx-auto">
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
      </div>
    </>
  );
}
