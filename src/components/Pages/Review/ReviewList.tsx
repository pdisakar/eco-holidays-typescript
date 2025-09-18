"use client";
import { useState } from "react";
import { PRODUCTION_SERVER, SITE_KEY } from "@/lib/constants";
import ReviewCard from "@/components/Card/ReviewCard";
import { Testimonial } from "@/types";



interface ReviewListProps {
  data: Testimonial[];
  list?: any;
  testimonials_count: number;
}

export default function ReviewList({ data, testimonials_count }: ReviewListProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(data);
  const [loading, setLoading] = useState<boolean>(false);

  const [hasMore, setHasMore] = useState<boolean>(testimonials.length < testimonials_count);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${PRODUCTION_SERVER}/alltestimonials?_start=${testimonials.length}&_limit=6`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            sitekey: SITE_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
      }

      const result = await response.json();
      const newTestimonials: Testimonial[] = result?.data?.content || [];

      setTestimonials((prev) => [...prev, ...newTestimonials]);

      if (testimonials.length + newTestimonials.length >= testimonials_count) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 mt-6 gap-y-10">
        {testimonials.map((itm) => (
          <li
            key={itm.id}
            className="[&>*]:bg-white [&>*]:border [&>*]:border-border [&>*]:h-full [&>*]:p-6 [&>*]:rounded-md"
          >
            <ReviewCard reviewData={itm} />
          </li>
        ))}
      </ul>
      
      {!hasMore && (
        <div className="text-center bg-white shadow rounded px-3 py-2 mt-6 text-secondary font-bold text-sm">
          <p>No more posts to load.</p>
        </div>
      )}
      
      {hasMore && (
        <div className="load-more text-center load-more-btn mt-6">
          <button
            type="button"
            className="btn btn-lg btn-primary uppercase rounded-full"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}