"use client";

import { useEffect, useState, useMemo } from "react";
import { PRODUCTION_SERVER, SITE_KEY } from "@/lib/constants";
import { SlidersHorizontal } from "lucide-react";
import BlogCard from "@/components/Card/BlogCard";

export default function BlogList({ data }) {
  const [posts, setPosts] = useState(data.listcontent);
  const [categoryLimit, setCategoryLimit] = useState(9);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Initialize checkboxes state
  const [checkboxes, setCheckboxes] = useState(
    data.blog_categories.map((itm) => ({
      value: itm.urlinfo.url_slug,
      label: itm.title,
      id: itm.id,
      checked: false,
      slug: itm.urlinfo.url_slug,
    }))
  );

  // Derive selected categories from checkboxes
  const categories = useMemo(
    () => checkboxes.filter((itm) => itm.checked).map((a) => a.slug),
    [checkboxes]
  );

  const fetchPosts = async (reset = false) => {
    try {
      setLoading(true);
      const start = reset ? 0 : posts.length;
      const limit = reset ? 12 : 6;

      const response = await fetch(
        `${PRODUCTION_SERVER}/allblogs?_start=${start}&_limit=${limit}&_categories="${categories.join(
          ","
        )}"`,
        {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          sitekey: SITE_KEY,
        },
      })
      const data = await response.json();
      const newPosts = data.data.content;
      setPosts((prevPosts) => (reset ? newPosts : [...prevPosts, ...newPosts]));
      setHasMore(newPosts.length > 0);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle checkbox state changes
  const handleCheckboxChange = (slug) => {
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((itm) =>
        itm.value === slug ? { ...itm, checked: !itm.checked } : itm
      )
    );
  };

  // Fetch posts when categories change
  useEffect(() => {
    fetchPosts(true); // Reset posts when categories change
  }, [categories]);

  return (
    <div className="container common-box pt-0">
      <div className="sorting border border-border p-6  rounded-md mb-6">
        <h4 className="text-md mb-3 font-bold text-primary uppercase flex items-center">
          <i className="icon h-5 w-5 text-primary mr-1">
            <SlidersHorizontal />
          </i>
          Sort By Category
        </h4>
        <ul className="blog-filter-list flex flex-wrap gap-3">
          {checkboxes.slice(0, categoryLimit).map((itm) => (
            <li key={itm.id}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={itm.value}
                  className="rounded"
                  value={itm.value}
                  checked={itm.checked}
                  onChange={() => handleCheckboxChange(itm.value)}
                />
                <label
                  className="ms-2 text-sm font-medium text-gray-900"
                  htmlFor={itm.value}
                >
                  {itm.label}
                </label>
              </div>
            </li>
          ))}
        </ul>
        {/* Expand/Collapse Categories */}
        <div className="more">
          <span
            onClick={() =>
              setCategoryLimit((prev) => (prev === 9 ? checkboxes.length : 9))
            }
            className="cursor-pointer text-xxs shadow-md shadow-primary/20 bg-primary px-4 py-1 text-white rounded-md uppercase font-bold inline-block mt-4"
          >
            {categoryLimit === 9 ? "+ more" : "- less"}
          </span>
        </div>
      </div>
      <div className="blog-list">
        <ul className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6">
          {posts.map((itm, idx) => (
            <li className="col-lg-4 col-md-6" key={idx}>
              <BlogCard blogData={itm} />
            </li>
          ))}
        </ul>
        {/* Load More Button */}
        {hasMore && (
          <div className="load-more load-more-btn mt-6">
            <button
              type="button"
              className="btn text-base border-0 font-bold rounded-lg px-5 py-2.5 block btn-primary"
              onClick={() => fetchPosts(false)} // Load more posts
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
        {/* No More Posts */}
        {!hasMore && (
          <div className="text-center py-4 text-secondary">
            <p>No more posts to load.</p>
          </div>
        )}
      </div>
    </div>
  );
}
