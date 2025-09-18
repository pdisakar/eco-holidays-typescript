import BookingComponent from "./Components/index";
import { getArticle, getContentByKeyType, getPackage } from "@/services/network_requests";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface BookingPageProps {
  searchParams: {
    _trip?: string;
    startDate?: string;
    endDate?: string;
    traveller?: string;
  };
}

// Define the Metadata function with explicit return type
export function generateMetadata(): Metadata {
  return {
    title: "Booking",
  };
}

export default async function BookingPage(props: BookingPageProps) {
    const searchParams = props.searchParams;
    const data = await getContentByKeyType("bookingpage");
    const packageData = await getArticle(searchParams._trip ?? "");
    

  if (!data || !packageData) {
    return notFound();
  }

  

  return (
    <>
      <BookingComponent
        packageData={packageData}
        data={data}
        startDateQuery={searchParams.startDate}
        endDateQuery={searchParams.endDate}
        numberOftraveller={searchParams.traveller}
      />
    </>
  );
}