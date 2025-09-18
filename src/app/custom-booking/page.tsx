import PaymentForm from "@/components/Pages/HBL";
import { getOptionsData } from "@/services/network_requests";
import type { Metadata } from "next";

interface PackageOption {
  id: string;
  title: string;
}

interface OptionsData {
  package: PackageOption[];
}

export function metadata(): Metadata {
  return {
    title: "Online Payment",
  };
}

export default async function Page() {
  const data: OptionsData = await getOptionsData();
  return <PaymentForm optionsData={data} />;
}