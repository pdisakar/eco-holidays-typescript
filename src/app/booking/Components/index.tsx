"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Script from "next/script";
import dynamic from "next/dynamic";
import "@/styles/react-date-picker.scss";
import { addDays, subDays } from "date-fns";
import { formatDate } from "@/lib/dateFormatter";
import {
    Check,
    FilePenLine,
    LockKeyhole,
    ShieldCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    PRODUCTION_SERVER,
    BASE_URL,
    IMAGE_URL,
    RECAPTCHA_SITE_KEY,
    SITE_KEY,
} from "@/lib/constants";
import countryCode from "@/lib/country-code.json";

// Dynamic imports
const DatePicker = dynamic(() => import("react-datepicker").then(mod => mod.default), { ssr: false });
const Incrementer = dynamic(() => import("@/components/Incrementer"), {
    ssr: false,
});

// Types
interface PriceGroup {
    id: number;
    min_people: number;
    max_people: number;
    unit_price: number;
}

interface AddOn {
    id: number;
    package_id: number;
    addon_title: string;
    addon_description: string;
    addon_price: number;
    addon_unit: string;
    addon_order: number;
    count?: number;
}

interface PackageContent {
    urlinfo: { url_slug: string };
    package_title: string;
    featured?: { full_path: string; alt_text?: string };
    id: string | number;
    package_duration: number;
    package_duration_type: string;
    pricegroup: PriceGroup[];
    add_ons: AddOn[];
}

interface PackageData {
    content: PackageContent;
}

interface PageContent {
    page_title: string;
}

interface BookingData {
    pagecontent: PageContent;
}

interface BookingComponentProps {
    packageData: PackageData;
    data: BookingData;
    startDateQuery?: string;
    endDateQuery?: string;
    numberOftraveller?: number;
}

interface FormValues {
    full_name: string;
    email: string;
    nationality: string;
    country_code: string;
    mobile_number: string;
    pickup_details: string;
}

interface CountryCode {
    name: string;
    dial_code: string;
}

export default function BookingComponent({
    packageData,
    data,
    startDateQuery,
    endDateQuery,
    numberOftraveller,
}: BookingComponentProps) {
    const {
        urlinfo,
        package_title,
        featured,
        id,
        package_duration,
        pricegroup,
        package_duration_type,
        add_ons
    } = packageData.content;

    // Add-ons state
    const [addonsWithCount, setAddonsWithCount] = useState<AddOn[]>(
        () => add_ons?.map((a) => ({ ...a, count: 0 })) ?? []
    );

    const updateCount = (id: number, newCount: number) => {
        setAddonsWithCount((prev) =>
            prev.map((itm) =>
                itm.id === id ? { ...itm, count: Math.max(newCount, 0) } : itm
            )
        );
    };

    // calculate grand total
    const addonsTotal = addonsWithCount.reduce(
        (sum, itm) => sum + (itm.count ?? 0) * itm.addon_price,
        0
    );

    // Initial state
    const [startDate, setStartDate] = useState<Date | null>(
        startDateQuery ? new Date(startDateQuery) : new Date()
    );
    const [endDate, setEndDate] = useState<Date | null>(
        endDateQuery
            ? new Date(endDateQuery)
            : addDays(new Date(), package_duration - 1)
    );
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
    const [traveller, setTraveller] = useState<number>(numberOftraveller ?? 1);
    const [terms, setTerms] = useState(false);
    const [pricePP, setPricePP] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [paymentOptions, setPaymentOptions] =
        useState<"partial_payment" | "fully_payment" | "pay_later">(
            "partial_payment"
        );
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormValues>();

    // Helpers
    const maxPeople = pricegroup[pricegroup.length - 1]?.max_people ?? 15;
    const minPeople = pricegroup[0]?.min_people ?? 1;

    const getPriceGroup = (num: number) =>
        pricegroup.find(
            (group) => num >= group.min_people && num <= group.max_people
        );

    useEffect(() => {
        const result = getPriceGroup(traveller);
        if (result) setPricePP(result.unit_price);
    }, [traveller, pricegroup]);

    const increment = () => {
        if (traveller < maxPeople) setTraveller((prev) => prev + 1);
    };

    const decrement = () => {
        if (traveller > minPeople) setTraveller((prev) => prev - 1);
    };

    const countryNameList = (countryCode as CountryCode[]).map((itm) => ({
        label: itm.name,
        value: itm.name,
    }));

    const countryCodeList = (countryCode as CountryCode[]).map((itm) => ({
        label: `${itm.name} (${itm.dial_code})`,
        value: itm.dial_code,
    }));

    const charge = (pricePP * traveller + addonsTotal) * (3.5 / 100);

    const onSubmit: SubmitHandler<FormValues> = async (formData) => {
        try {
            setLoading(true);

            const payload: any = {
                ...formData,
                date_of_birth: dateOfBirth
                    ? formatDate(dateOfBirth, "YYYY-MM-DD")
                    : null,
                trip_id: id,
                start_date: startDate
                    ? formatDate(startDate, "YYYY-MM-DD")
                    : null,
                end_date: endDate ? formatDate(endDate, "YYYY-MM-DD") : null,
                number_of_traveller: traveller,
                payment_options: paymentOptions,
                total_price: pricePP * traveller + addonsTotal + charge,
                payable_percentage:
                    paymentOptions === "partial_payment"
                        ? 20
                        : paymentOptions === "pay_later"
                            ? 0
                            : 100,
                add_ons: addonsWithCount
                    .filter((a) => (a.count ?? 0) > 0)
                    .map((a) => ({
                        id: a.id,
                        count: a.count,
                    })),
            };

            const baseAmount =
                ((pricePP * traveller + addonsTotal) * payload.payable_percentage) / 100;
            const totalPrice = baseAmount + (baseAmount * 3.5) / 100;

            const HBL_const = {
                customer_name: formData.full_name,
                customer_email: formData.email,
                package_id: Number(id),
                percent: payload.payable_percentage,
                customer_total: totalPrice,
            };

            const token = await new Promise<string>((resolve, reject) => {
                window.grecaptcha?.ready(async () => {
                    try {
                        const t = await window.grecaptcha!.execute(
                            RECAPTCHA_SITE_KEY,
                            { action: "booking_form" }
                        );
                        resolve(t);
                    } catch (err) {
                        reject(err);
                    }
                });
            });
            payload.captcha_response = token;

            const bookPackageResponse = await fetch(
                `${PRODUCTION_SERVER}/bookpackage`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        sitekey: SITE_KEY,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (bookPackageResponse.status === 200) {
                const paymentHblResponse = await fetch(
                    `${PRODUCTION_SERVER}/payment/hbl`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            sitekey: SITE_KEY,
                        },
                        body: JSON.stringify(HBL_const),
                    }
                );

                if (paymentHblResponse.status === 200) {
                    const paymentData = await paymentHblResponse.json();
                    router.push(paymentData.payment_url);
                    reset();
                    toast({
                        description: (
                            <div className="flex items-center gap-x-2 font-bold">
                                <i className="icon h-5 w-5 bg-success text-white rounded-full p-1">
                                    <Check />
                                </i>
                                <span>Your information has been submitted.</span>
                            </div>
                        ),
                    });
                }
            }
        } catch (error: any) {
            toast({
                description: (
                    <div className="flex items-center gap-x-2 font-bold text-danger">
                        <span>{error.message || "Some error occurred"}</span>
                    </div>
                ),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault();
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="common-box pt-0 booking-form">
            <Script
                src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
                strategy="lazyOnload"
            />
            <div className="container">
                <div className="page-title pt-10 pb-6">
                    <h1>{data.pagecontent.page_title}</h1>
                </div>
                <div className="grid lg:grid-cols-12 gap-6" id="booking-form-wrapper">
                    <div className="lg:col-span-8">
                        <div className="booking-list common-module">
                            <ul>
                                <li>
                                    <div className="item lg:grid items-center lg:grid-cols-6 lg:gap-3  border border-white shadow-[0_0_4px] shadow-secondary/20 bg-secondary/5 p-3 rounded-md">
                                        <div className="image-slot lg:col-span-1">
                                            <Link
                                                href={BASE_URL + urlinfo.url_slug}
                                                className="intro-image rounded-md block overflow-hidden"
                                            >
                                                {featured && (
                                                    <Image
                                                        src={IMAGE_URL + featured?.full_path}
                                                        alt={
                                                            featured.alt_text
                                                                ? featured?.alt_text
                                                                : package_title
                                                        }
                                                        height={350}
                                                        width={450}
                                                    />
                                                )}
                                            </Link>
                                        </div>
                                        <div className="intro-text pt-3 lg:pt-0 lg:col-span-5">
                                            <h3 className="text-xl capitalize mb-2.5">
                                                <Link href={BASE_URL + urlinfo.url_slug}>
                                                    {package_title}
                                                </Link>
                                            </h3>

                                            <div className="meta font-medium text-md">
                                                <ul>
                                                    <li className="flex items-center gap-x-1">
                                                        Starting:
                                                        {startDate && (
                                                            <span className="text-primary font-bold">
                                                                {formatDate(startDate, "Do MMM, YYYY")}
                                                            </span>
                                                        )}
                                                        <div className="relative inline-block">
                                                            <span
                                                                className=" ml-1 text-secondary text-xs cursor-pointer flex items-center gap-x-1 underline"
                                                                onClick={handleClick}
                                                            >
                                                                <FilePenLine className="icon h-5 w-5 align-middle" /> Change
                                                            </span>
                                                            <div
                                                                id="datepicker"
                                                                className="custom-date-picker absolute right-0 translate-x-1/2 top-full z-10"
                                                            >
                                                                {isOpen && (
                                                                    <DatePicker
                                                                        selected={startDate}
                                                                        onChange={(update: Date | null) => {
                                                                            if (!update) return;
                                                                            setStartDate(update);
                                                                            setEndDate(
                                                                                package_duration_type.toLowerCase() ===
                                                                                    "days"
                                                                                    ? addDays(
                                                                                        update,
                                                                                        package_duration - 1
                                                                                    )
                                                                                    : update
                                                                            );
                                                                            setIsOpen(false);
                                                                        }}
                                                                        dateFormat="dd/MM/yyyy"
                                                                        minDate={addDays(new Date(), 1)}
                                                                        className="form-control"
                                                                        monthsShown={1}
                                                                        inline
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        Ending:{" "}
                                                        {endDate && (
                                                            <span className="text-primary font-bold">
                                                                {formatDate(endDate, "Do MMM, YYYY")}
                                                            </span>
                                                        )}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <form
                            id="booking-form"
                            className="needs-validation flm-form"
                            noValidate
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            {isSubmitting ? <div className="loading"></div> : null}
                            <div className="common-module">
                                <div className="module-title">
                                    <span className="number">1</span>
                                    <div className="text">
                                        <h3 className="text-[1.375rem] font-bold">
                                            How many are travelling?
                                        </h3>
                                        <span className="subtitle">Group discount available</span>
                                    </div>
                                </div>

                                <div className="module-body">
                                    {pricegroup.length > 1 && (
                                        <div className="text-primary mb-6 font-bold text-md">
                                            <ul className="[&>li+li]:mt-1">
                                                {pricegroup.map((itm) => (
                                                    <li key={itm.id}>
                                                        <span>
                                                            {itm.min_people === itm.max_people
                                                                ? itm.min_people
                                                                : `${itm.min_people} - ${itm.max_people}`}{" "}
                                                            Pax
                                                        </span>
                                                        <span className="divider mx-2.5">-----</span>
                                                        <span>US$ {itm.unit_price}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="col-span-2">
                                            <label htmlFor="traveller" className="mb-1.5 block">
                                                <b>No of Travelers</b>
                                            </label>
                                            <Suspense fallback={<p>Loading..</p>}>
                                                <Incrementer
                                                    number={traveller}
                                                    increment={increment}
                                                    decrement={decrement}
                                                    min={minPeople}
                                                    max={maxPeople}
                                                />
                                            </Suspense>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                add_ons?.length > 0 &&

                                <div className="common-module">
                                    <div className="module-title">
                                        <span className="number">2</span>
                                        <div className="text">
                                            <h3 className="text-[1.375rem] font-bold">
                                                Add-Ons or Extra Options
                                            </h3>
                                            <span className="subtitle">
                                                Enhance your journey with trip optional add-ons!
                                            </span>
                                        </div>
                                    </div>
                                    <div className="module-body">
                                        <ul className="space-y-6">
                                            {addonsWithCount.map((itm) => {
                                                const unit = itm.addon_unit === "undefined" ? "PP" : itm.addon_unit;
                                                const total = (itm.count ?? 0) * itm.addon_price;

                                                return (
                                                    <li key={itm.id} className="border-b border-muted/30 pb-4">
                                                        <h4 className="mb-1 text-lg font-semibold">{itm.addon_title}</h4>
                                                        <p className="text-xs font-medium text-muted">
                                                            {itm.addon_description}
                                                        </p>
                                                        <div className="flex items-center gap-x-4 mt-3">
                                                            <Suspense fallback={<p>Loading...</p>}>
                                                                <Incrementer
                                                                    number={itm.count ?? 0}
                                                                    increment={() => updateCount(itm.id, (itm.count ?? 0) + 1)}
                                                                    decrement={() => updateCount(itm.id, (itm.count ?? 0) - 1)}
                                                                    min={0}
                                                                    max={15}
                                                                />
                                                            </Suspense>
                                                            <div className="flex items-center gap-x-1">
                                                                <span className="text-lg font-secondary font-semibold">
                                                                    US ${itm.addon_price}
                                                                </span>
                                                                <sub className="text-sm font-semibold text-muted">{unit}</sub>
                                                            </div>
                                                            {(itm.count ?? 0) > 0 && (
                                                                <div className="ml-auto text-right">
                                                                    <span className="text-base font-semibold text-primary">
                                                                        + US ${total}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            }

                            <div className="common-module">
                                <div className="module-title">
                                    <span className="number">{add_ons?.length > 0 ? 3 : 2}</span>
                                    <div className="text">
                                        <h3 className="text-[1.375rem] font-bold">
                                            Lead Traveller
                                        </h3>
                                        <span className="subtitle">
                                            This traveller will serve as the contact person for the
                                            booking.
                                        </span>
                                    </div>
                                </div>

                                <div className="module-body">
                                    <div className="grid grid-cols-2 gap-x-3 gap-y-6">
                                        <div className="col-span-2">
                                            <label className="col-form-label" htmlFor="full_name">
                                                Name & Email*
                                                <p className="help-text">
                                                    Per your passport details.
                                                </p>
                                            </label>
                                        </div>
                                        <div className="col-lg-6">
                                            <input
                                                type="text"
                                                placeholder="Full Name*"
                                                className="form-control"
                                                {...register("full_name", { required: true })}
                                                aria-invalid={errors.full_name ? "true" : "false"}
                                            />
                                        </div>
                                        <div className="col-lg-6">
                                            <input
                                                type="email"
                                                placeholder="E-mail ID*"
                                                className="form-control"
                                                required
                                                {...register("email", {
                                                    required: true,
                                                    pattern: {
                                                        value: /\S+@\S+\.\S+/,
                                                        message:
                                                            "Entered value does not match email format",
                                                    },
                                                })}
                                                aria-invalid={errors.email ? "true" : "false"}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="col-form-label" htmlFor="date_of_birth">
                                                Date of Birth / Nationality*{" "}
                                                <p className="help-text">
                                                    The lead traveller should be 18 years or above.
                                                </p>
                                            </label>
                                        </div>
                                        <div className="col-lg-6">
                                            <div id="datepicker" className="custom-date-picker">
                                                <DatePicker
                                                    selected={dateOfBirth}
                                                    onChange={(update: Date | null) => {
                                                        setDateOfBirth(update);
                                                    }}
                                                    dateFormat="dd/MM/yyyy"
                                                    maxDate={subDays(new Date(), 2)}
                                                    className="form-control"
                                                    monthsShown={1}
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="custom_select">
                                                <span className="select_indicator"></span>
                                                <select
                                                    className="form-control"
                                                    {...register("nationality", {
                                                        required: true,
                                                    })}
                                                    aria-invalid={errors.nationality ? "true" : "false"}
                                                >
                                                    <option value="">Select Nationality*</option>
                                                    {countryNameList.map((itm, idx) => (
                                                        <option value={itm.value} key={idx}>
                                                            {itm.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <label className="col-form-label" htmlFor="mobile_no">
                                                Mobile Number*
                                                <p className="help-text">
                                                    This is how we will get in touch with you, if we
                                                    need to reach you at your destination
                                                </p>
                                            </label>
                                        </div>

                                        <div className="col-span-2">
                                            <div className="grid md:grid-cols-12 gap-3">
                                                <div className="md:col-span-3">
                                                    <div className="custom_select">
                                                        <span className="select_indicator"></span>
                                                        <select
                                                            id="country_code"
                                                            className="form-control"
                                                            {...register("country_code", {
                                                                required: true,
                                                            })}
                                                            aria-invalid={
                                                                errors.country_code ? "true" : "false"
                                                            }
                                                        >
                                                            <option value="">Country Code*</option>
                                                            {countryCodeList.map((itm, idx) => (
                                                                <option value={itm.value} key={idx}>
                                                                    {itm.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="md:col-span-9">
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        placeholder="Mobile number*"
                                                        {...register("mobile_number", {
                                                            required: true,
                                                        })}
                                                        aria-invalid={
                                                            errors.mobile_number ? "true" : "false"
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <label
                                                className="col-form-label"
                                                htmlFor="pickup-detail"
                                            >
                                                Special Requirement*
                                                <p className="help-text">
                                                    Please tell us more about yourself to help you
                                                    better.
                                                </p>
                                            </label>
                                        </div>

                                        <div className="col-span-2">
                                            <textarea
                                                id="pickup-detail"
                                                rows={6}
                                                className="form-control"
                                                {...register("pickup_details", {
                                                    required: true,
                                                })}
                                                aria-invalid={
                                                    errors.pickup_details ? "true" : "false"
                                                }
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="common-module">
                                <div className="module-title">
                                    <span className="number">{add_ons?.length > 0 ? 4 : 3}</span>
                                    <div className="text">
                                        <h3 className="text-[1.375rem] font-bold">Payment</h3>
                                        <span className="subtitle">
                                            Please Select the payment options
                                        </span>
                                    </div>
                                </div>
                                <div className="module-body">
                                    <div className="mb-3 p-3 relative bg-secondary/10 rounded-lg xl:p-6">
                                        <div className="content relative pl-8 font-semibold text-md text-secondary">
                                            <i className="icon h-7 w-7 inline-block text-secondary absolute left-0 top-0">
                                                <LockKeyhole />
                                            </i>
                                            <div>
                                                <p className="mb-0">
                                                    This is a secure and SSL encrypted payment via 2C2P.
                                                    Your credit card details are safe!
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="custom-form-check-inline">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                value="partial_payment"
                                                type="radio"
                                                name="paymentOptions"
                                                id="partial_payment"
                                                onChange={(e) =>
                                                    setPaymentOptions(
                                                        e.target.value as
                                                        | "partial_payment"
                                                        | "fully_payment"
                                                        | "pay_later"
                                                    )
                                                }
                                                checked={paymentOptions === "partial_payment"}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="partial_payment"
                                            >
                                                <h5>
                                                    20% Deposit{" "}
                                                    <i className="icon">
                                                        <ShieldCheck />
                                                    </i>
                                                </h5>
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                value="fully_payment"
                                                type="radio"
                                                name="paymentOptions"
                                                id="full_options"
                                                onChange={(e) =>
                                                    setPaymentOptions(
                                                        e.target.value as
                                                        | "partial_payment"
                                                        | "fully_payment"
                                                        | "pay_later"
                                                    )
                                                }
                                                checked={paymentOptions === "fully_payment"}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="full_options"
                                            >
                                                <h5>
                                                    100% Full Payment
                                                    <i className="icon">
                                                        <ShieldCheck />
                                                    </i>
                                                </h5>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sidebar-module border rounded-md package-booking-slot mb-5 bg-white p-6 lg:hidden">
                                <h3 className="mb-4 text-headings font-medium text-lg">
                                    Summary
                                </h3>
                                <div className="trip-info leading-[1.25]">
                                    <ul>
                                        <li>
                                            <p>
                                                <b>Package Price:</b>
                                                <span className="text-muted font-normal text-xs">{traveller + "x" + pricePP}</span>
                                            </p>
                                            <p>
                                                <span className="big text-primary">
                                                    US$ {pricePP * traveller}
                                                </span>
                                            </p>
                                        </li>
                                        {
                                            addonsWithCount.map((itm, idx) => {
                                                return (
                                                    (itm.count ?? 0) > 0 &&
                                                    <li key={idx}>
                                                        <p className="font-medium">
                                                            <b>{itm.addon_title}</b>
                                                            <span className="text-muted font-normal text-xs">{`${itm.addon_price} x ${itm.count}`}</span>
                                                        </p>
                                                        <p className="text-primary">US$ {itm.addon_price * (itm.count ?? 0)}</p>
                                                    </li>
                                                )
                                            })
                                        }
                                        <li>
                                            <p>
                                                <b>Total Price:</b>
                                                <span className="text-muted font-normal text-xs">{traveller + "x" + pricePP}</span>
                                            </p>
                                            <p>
                                                <span className="big text-primary">
                                                    US$ {(pricePP * traveller) + addonsTotal}
                                                </span>
                                            </p>
                                        </li>
                                        {paymentOptions === "partial_payment" && (
                                            <>
                                                <li>
                                                    <p>
                                                        <b>Deposit Payable Now:</b>
                                                    </p>
                                                    <p className="text-primary">
                                                        US${" "}
                                                        {((20 / 100) * ((pricePP * traveller) + addonsTotal)).toFixed(2)}
                                                    </p>
                                                </li>
                                                <li>
                                                    <p>
                                                        <b>Remaining Amount:</b>
                                                        <span className="text-muted font-normal text-xs">(Pay Later)</span>
                                                    </p>
                                                    <p className="text-primary">
                                                        US${" "}
                                                        {(
                                                            ((pricePP * traveller) + addonsTotal) -
                                                            (20 / 100) * ((pricePP * traveller) + addonsTotal)
                                                        ).toFixed(2)}
                                                    </p>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                                <div className="associates mt-7 text-right">
                                    <div className="content-list cards">
                                        <p className="text-headings/70 text-sm leading-[1.4] font-medium mb-1">
                                            This is a secure and SSL encrypted payment. Your card
                                            details are safe!
                                        </p>
                                        <figure className="card inline-block">
                                            <Image
                                                src="/cards.svg"
                                                height={25}
                                                width={158}
                                                alt="We Accept"
                                            />
                                        </figure>
                                    </div>
                                </div>
                            </div>

                            <div className="form-check flex items-center  mb-5">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={terms}
                                    id="terms"
                                    onChange={(e) => setTerms(e.target.checked)}
                                />
                                <label
                                    className="form-check-label inline-flex items-center"
                                    htmlFor="terms"
                                >
                                    <b>I accept terms and conditions</b> &nbsp;
                                </label>
                            </div>
                            <button
                                className="bg-primary rounded-md font-extrabold capitalize text-base text-white py-2 px-5 md:py-3 md:px-8 w-full disabled:opacity-80"
                                type="submit"
                                disabled={!terms || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>Processing</>
                                ) : paymentOptions === "pay_later" ? (
                                    "Confirm Booking"
                                ) : (
                                    "Proceed to Payment"
                                )}
                            </button>
                        </form>
                    </div>
                    <aside className="sidebar lg:col-span-4 hidden lg:block">
                        <div className="sticky top-5">
                            <div className="sidebar-module border rounded-md package-booking-slot bg-white p-6">
                                <h3 className="mb-4 text-headings font-medium text-lg">
                                    Summary
                                </h3>
                                <div className="trip-info leading-[1.25]">
                                    <ul>
                                        <li>
                                            <p>
                                                <b>Package Price:</b>
                                                <span className="text-muted font-normal text-xs">{traveller + "x" + pricePP}</span>
                                            </p>
                                            <p>
                                                <span className="big text-primary">
                                                    US$ {pricePP * traveller}
                                                </span>
                                            </p>
                                        </li>
                                        {
                                            addonsWithCount.map((itm, idx) => {
                                                return (
                                                    (itm.count ?? 0) > 0 &&
                                                    <li key={idx}>
                                                        <p className="font-medium">
                                                            <b>{itm.addon_title}</b>
                                                            <span className="text-muted font-normal text-xs">{`${itm.addon_price} x ${itm.count}`}</span>
                                                        </p>
                                                        <p className="text-primary">US$ {itm.addon_price * (itm.count ?? 0)}</p>
                                                    </li>
                                                )
                                            })
                                        }
                                        <li>
                                            <p>
                                                <b>Total Price:</b>
                                                <span className="text-muted font-normal text-xs">{traveller + "x" + pricePP}</span>
                                            </p>
                                            <p>
                                                <span className="big text-primary">
                                                    US$ {(pricePP * traveller) + addonsTotal}
                                                </span>
                                            </p>
                                        </li>
                                        {paymentOptions === "partial_payment" && (
                                            <>
                                                <li>
                                                    <p>
                                                        <b>Deposit Payable Now:</b>
                                                    </p>
                                                    <p className="text-primary">
                                                        US${" "}
                                                        {((20 / 100) * ((pricePP * traveller) + addonsTotal)).toFixed(2)}
                                                    </p>
                                                </li>
                                                <li>
                                                    <p>
                                                        <b>Remaining Amount:</b>
                                                        <span className="text-muted font-normal text-xs">(Pay Later)</span>
                                                    </p>
                                                    <p className="text-primary">
                                                        US${" "}
                                                        {(
                                                            ((pricePP * traveller) + addonsTotal) -
                                                            (20 / 100) * ((pricePP * traveller) + addonsTotal)
                                                        ).toFixed(2)}
                                                    </p>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                                <div className="associates mt-7 text-right">
                                    <div className="content-list cards">
                                        <p className="text-headings/70 text-sm leading-[1.4] font-medium mb-1">
                                            This is a secure and SSL encrypted payment. Your card
                                            details are safe!
                                        </p>
                                        <figure className="card inline-block">
                                            <Image
                                                src="/cards.svg"
                                                height={25}
                                                width={158}
                                                alt="We Accept"
                                            />
                                        </figure>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}