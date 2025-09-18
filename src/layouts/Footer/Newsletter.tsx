"use client";

import { useRef, useState } from "react";
import { PRODUCTION_SERVER, SITE_KEY } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { BadgeInfo, Check, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsletterProps {
  title: string;
  subTitle?: string;
  btnLabel: string;
  className?: string;
}

export default function Newsletter({
  title,
  subTitle,
  btnLabel,
  className,
}: NewsletterProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    formRef.current?.reset();
  };

  const subscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(false);

    const form = event.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;

    try {
      const res = await fetch(`${PRODUCTION_SERVER}/newsletter/subscribe`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          sitekey: SITE_KEY,
        },
        body: JSON.stringify({ name, email }),
      });

      const result = await res.json();

      if (res.ok) {
        toast({
          description: (
            <div className="flex items-center gap-x-2 font-bold">
              <i className="icon h-5 w-5 bg-success text-white rounded-full p-1">
                <Check />
              </i>
              <span>{result.message}</span>
            </div>
          ),
        });
        resetForm();
      } else {
        setError(true);
        toast({
          description: (
            <div className="flex items-center gap-x-2 font-bold">
              <i className="icon h-5 w-5 text-danger">
                <BadgeInfo />
              </i>
              <span>{result.message || "Something went wrong."}</span>
            </div>
          ),
        });
      }
    } catch (err: any) {
      setError(true);
      toast({
        description: (
          <div className="flex items-center gap-x-2 font-bold">
            <i className="icon h-5 w-5 text-danger">
              <BadgeInfo />
            </i>
            <span>{err.message || "Network error."}</span>
          </div>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("newsletter md:grid md:grid-cols-2 md:gap-6", className)}>
      <div className="flex items-center leading-[1]">
        <svg height={70} width={70} className="text-primary flex-[0_0_70px]"><use xlinkHref="/icons.svg#newsletter-envelope" /></svg>
        <div className="flex-[0_0_calc(100%_-_70px)] pl-5">
          <h3
            className="text-xl md:text-[2.25rem] font-light text-headings font-secondary mb-0"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          {subTitle && <p className=" tracking-wide text-base font-medium pt-1.5 text-muted">{subTitle}</p>}
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={subscribe}
        id="newsletter-form"
        className="z-20 relative pr-[110px] md:pr-[170px] mt-6 md:mt-0 flex flex-col overflow-hidden"
      >
        <div className="form-group">
          <label htmlFor="name" hidden>
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Full Name*"
            className="form-control outline-none w-full p-[8px_0] bg-transparent font-normal border-0 text-body md:text-[1.25rem] placeholder:text-muted"
          />
        </div>

        <div className="form-group flex-1 border-t-2 border-t-border">
          <label htmlFor="email" hidden>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Email Address*"
            className="form-control outline-none w-full p-[8px_0] bg-transparent font-normal border-0 text-body md:text-[1.25rem] placeholder:text-muted"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className=" absolute right-0 top-1/2 -translate-y-1/2 bg-primary text-white text-sm md:text-base  uppercase inline-flex px-4 py-2 md:p-[.8375rem_2.25rem]  border-0 items-center font-medium rounded"
        >
          {loading ? "Submitting..." : btnLabel}
        </button>
      </form>
    </div>
  );
}
