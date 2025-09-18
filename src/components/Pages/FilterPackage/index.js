"use client"
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Range, getTrackBackground } from "react-range";
import AnimateHeight from "react-animate-height";
import PackageItem from "@/components/PackageItem/Package";
import Loading from "../../Loading";
import axios from "axios";
import { BASE_URL, PRODUCTION_SERVER, SITE_KEY } from "@/lib/constants";
const Breadcrumb = dynamic(() => import("@/components/Breadcrumb"));

export default function FilterPackage({ data }) {
  const [height, setHeight] = useState(300);
  const [active, setActive] = useState(false);
  const [categoryHeight, setCategoryHeight] = useState(300);
  const [categoryActive, setCategoryActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({
    categories: [],
    grade: [],
    style: [],
    title: "",
    duration: [1, data?.max_duration],
    price: [10, data?.max_price],
  });
  const [packages, setPackages] = useState(data.packages);

  //animate heights
  const toggleHeight = () => {
    setActive(!active);
    setHeight(height === 300 ? "auto" : 300);
  };

  //animate heights
  const toggleCategoryHeight = () => {
    setCategoryActive(!categoryActive); 
    setCategoryHeight(categoryHeight === 300 ? "auto" : 300);
  };

  const handleCategoryChange = (e) => {
    if (e.target.checked) {
      setFilterData({
        ...filterData,
        categories: [...filterData.categories, Number(e.target.value)],
      });
    } else {
      setFilterData({
        ...filterData,
        categories: filterData.categories.filter(
          (checkbox) => checkbox !== Number(e.target.value)
        ),
      });
    }
  };

  const handleGradingChange = (e) => {
    if (e.target.checked) {
      setFilterData({
        ...filterData,
        grade: [...filterData.grade, Number(e.target.value)],
      });
    } else {
      setFilterData({
        ...filterData,
        grade: filterData.grade.filter(
          (checkbox) => checkbox !== Number(e.target.value)
        ),
      });
    }
  };

  const handleStyleChange = (e) => {
    if (e.target.checked) {
      setFilterData({
        ...filterData,
        style: [...filterData.style, Number(e.target.value)],
      });
    } else {
      setFilterData({
        ...filterData,
        style: filterData.style.filter(
          (checkbox) => checkbox !== Number(e.target.value)
        ),
      });
    }
  };

  const destinations = data?.categories.destination.map((itm) => {
    return {
      title: itm.title,
      id: itm.id,
      ...(itm?.children?.length >= 1 && {
        children: itm.children?.map((ktm) => {
          return {
            title: ktm.title,
            id: ktm.id,
            parent_id: itm.id,
            ...(ktm?.children?.length >= 1 && {
              children: ktm.children?.map((jtm) => {
                return {
                  title: jtm.title,
                  id: jtm.id,
                  parent_id: ktm.id,
                };
              }),
            }),
          };
        }),
      }),
    };
  });

  const fetchData = async (offset) => {
    setLoading(true);
    try {
      let filterString = "";
      if (filterData.title)
        filterString = filterString + "&_name=" + filterData.title;
      if (filterData.grade.length)
        filterString = filterString + "&_grades=[" + filterData.grade + "]";
      if (filterData.style.length)
        filterString = filterString + "&_styles=[" + filterData.style + "]";
      if (filterData.categories.length)
        filterString =
          filterString + "&_destinations=[" + filterData.categories + "]";
      if (offset)
        filterString = filterString + "&_limit=9&_offset=" + packages.length;
      if (filterData.price)
        filterString =
          filterString +
          "&_lowPrice=" +
          filterData.price[0] +
          "&_highPrice=" +
          filterData.price[1];
      if (filterData.duration)
        filterString =
          filterString +
          "&_minDuration=" +
          filterData.duration[0] +
          "&_maxDuration=" +
          filterData.duration[1];
      const response = await axios.get(`${PRODUCTION_SERVER}/filterpackages?${filterString}`, { headers: { sitekey: SITE_KEY } });
      const newData = await response.data.data.content;
      if (offset) {
        setPackages([...packages, ...newData]);
        setFading("fading");
      } else {
        setPackages([...newData]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filterData) {
        fetchData();
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [filterData]);

  const loadMore = async () => {
    const offset = packages.length;
    await fetchData(offset);
  };

  return (
    <>
      <div className="common-box search-page" role="main">
        <div className="container">
          <div className="grid grid-cols-12 gap-6">
            <aside className="sidebar search-bar col-span-3 shadow-base p-8 rounded relative">
              <div className="search-module">
                <h3 className="module-title">Duration</h3>
                <div className="custom-range">
                  <div className="output">
                    <span className="normal">
                      {filterData.duration[0]} to {filterData.duration[1]} Days
                    </span>
                    <span className="avrage">
                      Average Duration:{" "}
                      {" " +
                        (
                          (filterData.duration[0] + filterData.duration[1]) /
                          2
                        ).toFixed(0)}
                    </span>
                  </div>
                  <div className="range-slot">
                    <Range
                      draggableTrack
                      values={filterData.duration}
                      step={1}
                      min={1}
                      max={data.max_duration}
                      onChange={(values) => {
                        setFilterData({
                          ...filterData,
                          duration: values,
                        });
                      }}
                      renderTrack={({ props, children }) => (
                        <div
                          onMouseDown={props.onMouseDown}
                          onTouchStart={props.onTouchStart}
                          className="track"
                          style={{
                            ...props.style,
                          }}
                        >
                          <div
                            ref={props.ref}
                            className="active-track"
                            style={{
                              background: getTrackBackground({
                                values: filterData.duration,
                                colors: ["#cad3d5", "#0cb6d8", "#cad3d5"],
                                min: 1,
                                max: data.max_duration,
                              }),
                            }}
                          >
                            {children}
                          </div>
                        </div>
                      )}
                      renderThumb={({ props, isDragged }) => (
                        <div
                          {...props}
                          className="track-thumb"
                          style={{
                            ...props.style,
                          }}
                        >
                          <span className={isDragged ? "focus" : ""} />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="search-module">
                <h3 className="module-title">Price</h3>
                <div className="custom-range">
                  <div className="output">
                    <span className="normal">
                      US ${filterData.price[0]} - ${filterData.price[1]}
                    </span>
                    <span className="avrage">
                      Average Price:{" "}
                      {"US $" +
                        (
                          (filterData.price[0] + filterData.price[1]) /
                          2
                        ).toFixed(0)}
                    </span>
                  </div>
                  <div className="range-slot">
                    <Range
                      draggableTrack
                      values={filterData.price}
                      step={100}
                      min={10}
                      max={data.max_price}
                      onChange={(values) => {
                        setFilterData({
                          ...filterData,
                          price: values,
                        });
                      }}
                      renderTrack={({ props, children }) => (
                        <div
                          onMouseDown={props.onMouseDown}
                          onTouchStart={props.onTouchStart}
                          className="track"
                          style={{
                            ...props.style,
                          }}
                        >
                          <div
                            ref={props.ref}
                            className="active-track"
                            style={{
                              background: getTrackBackground({
                                values: filterData.price,
                                colors: ["#cad3d5", "#0cb6d8", "#cad3d5"],
                                min: 1,
                                max: data.max_price,
                              }),
                            }}
                          >
                            {children}
                          </div>
                        </div>
                      )}
                      renderThumb={({ props, isDragged }) => (
                        <div
                          {...props}
                          className="track-thumb"
                          style={{
                            ...props.style,
                          }}
                        >
                          <span className={isDragged ? "focus" : ""} />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="search-module">
                <h3 className="module-title">Category</h3>
                <AnimateHeight duration={500} height={categoryHeight}>
                  <div className="checkbox-list">
                    <ul>
                      {destinations?.map((itm, idx) => {
                        return (
                          <li key={itm.id}>
                            <div className="form-option form-check">
                              <input
                                type="checkbox"
                                id={itm.id}
                                className="form-check-input"
                                value={itm.id}
                                onChange={(e) => handleCategoryChange(e)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={itm.id}
                              >
                                {itm.title}
                              </label>
                            </div>
                            {itm.children?.length >= 1 && (
                              <ul>
                                {itm.children?.map((itm, jdx) => {
                                  return (
                                    <li key={jdx}>
                                      <div className="form-option form-check">
                                        <input
                                          type="checkbox"
                                          id={itm.id}
                                          className="form-check-input"
                                          value={itm.id}
                                          onChange={(e) =>
                                            handleCategoryChange(e)
                                          }
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={itm.id}
                                        >
                                          {itm.title}
                                        </label>
                                      </div>
                                      {itm.children?.length >= 1 && (
                                        <ul>
                                          {itm.children?.map((itm, kdx) => {
                                            return (
                                              <li key={kdx}>
                                                <div className="form-option form-check">
                                                  <input
                                                    type="checkbox"
                                                    id={itm.id}
                                                    className="form-input form-check-input"
                                                    value={itm.id}
                                                    onChange={(e) =>
                                                      handleCategoryChange(e)
                                                    }
                                                  />
                                                  <label
                                                    className="form-check-label"
                                                    htmlFor={itm.id}
                                                  >
                                                    {itm.title}
                                                  </label>
                                                </div>
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </AnimateHeight>
                <span className="btn-moreless" onClick={toggleCategoryHeight}>
                  {categoryHeight === 300 ? "+ Show All" : "- Show Less"}
                </span>
              </div>

              <div className="search-module">
                <h3 className="module-title">Trip Grading</h3>
                <div className="checkbox-list">
                  <ul>
                    {data.categories.trip_gradings?.map((itm, idx) => {
                      return (
                        <li key={itm.id}>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              id={itm.id}
                              className="form-check-input"
                              value={itm.id}
                              onChange={(e) => handleGradingChange(e)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={itm.id}
                            >
                              {itm.title}
                            </label>
                          </div>
                          {itm.children?.length >= 1 && (
                            <ul>
                              {itm.children?.map((itm, jdx) => {
                                return (
                                  <li key={jdx}>
                                    <div className="form-option">
                                      <input
                                        type="checkbox"
                                        id={itm.id}
                                        className="form-input blog-cat"
                                        value={itm.id}
                                        onChange={(e) =>
                                          handleCheckboxChange(e)
                                        }
                                      />
                                      <label htmlFor={itm.id}>
                                        {itm.title}
                                      </label>
                                    </div>
                                    {itm.children?.length >= 1 && (
                                      <ul>
                                        {itm.children?.map((itm, kdx) => {
                                          return (
                                            <li key={kdx}>
                                              <div className="form-option">
                                                <input
                                                  type="checkbox"
                                                  id={itm.id}
                                                  className="form-input blog-cat"
                                                  value={itm.id}
                                                  onChange={(e) =>
                                                    handleCheckboxChange(e)
                                                  }
                                                />
                                                <label htmlFor={itm.id}>
                                                  {itm.title}
                                                </label>
                                              </div>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="search-module">
                <h3 className="module-title">Trip Style</h3>
                <AnimateHeight duration={500} height={height}>
                  <div className="checkbox-list">
                    <ul>
                      {data.categories.trip_style?.map((itm, idx) => {
                        return (
                          <li key={itm.id}>
                            <div className="form-option form-check">
                              <input
                                type="checkbox"
                                id={itm.id}
                                className="form-input form-check-input"
                                value={itm.id}
                                onChange={(e) => handleStyleChange(e)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={itm.id}
                              >
                                {itm.title}
                              </label>
                            </div>
                            {itm.children?.length >= 1 && (
                              <ul>
                                {itm.children?.map((itm, jdx) => {
                                  return (
                                    <li key={jdx}>
                                      <div className="form-option">
                                        <input
                                          type="checkbox"
                                          id={itm.id}
                                          className="form-input blog-cat"
                                          value={itm.id}
                                          onChange={(e) =>
                                            handleCheckboxChange(e)
                                          }
                                        />
                                        <label htmlFor={itm.id}>
                                          {itm.title}
                                        </label>
                                      </div>
                                      {itm.children?.length >= 1 && (
                                        <ul>
                                          {itm.children?.map((itm, kdx) => {
                                            return (
                                              <li key={kdx}>
                                                <div className="form-option">
                                                  <input
                                                    type="checkbox"
                                                    id={itm.id}
                                                    className="form-input blog-cat"
                                                    value={itm.id}
                                                    onChange={(e) =>
                                                      handleCheckboxChange(e)
                                                    }
                                                  />
                                                  <label htmlFor={itm.id}>
                                                    {itm.title}
                                                  </label>
                                                </div>
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </AnimateHeight>
                <span className="btn-moreless" onClick={toggleHeight}>
                  {height === 300 ? "+ Show All" : "- Show Less"}
                </span>
              </div>
            </aside>
            <div className="col-span-9 lg:pl-3">
              <div className="result-container">
                <div className="title mb-0">
                  <h1>{data?.pagecontent?.page_title}</h1>
                </div>
                <Breadcrumb currentPage="Package" />
                <div className="trip-search common-module">
                  <form>
                    <div className="form-group">
                      <label htmlFor="location" hidden>
                        Location
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search package by title"
                        onChange={(e) =>
                          setFilterData({
                            ...filterData,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-md">
                      <i className="icon">
                        <svg><use xlinkHref={BASE_URL+'sprite.svg#search'} /></svg>
                      </i>
                    </button>
                  </form>
                </div>

                {loading && (
                  <div className={loading ? "loading active" : "loading"}>
                    <i className="icon">
                      <Loading fill="currentColor" />
                    </i>
                  </div>
                )}
                <div className="package-layot__grid-classic">
                  <ul className="grid gap-5 lg:grid-cols-3 md:grid-cols-2">
                    {packages?.map((itm, index) => {
                      return (
                        <li key={index}>
                          <PackageItem packageData={itm} />
                        </li>
                      );
                    })}
                  </ul>
                  {packages?.length == 0 && (
                    <div className="travel-alert custom_alert alert-info fade show">
                      No Package Found
                    </div>
                  )}
                </div>
                {packages.length >= 9 && (
                  <>
                    <br />
                    <br />
                    {loading && (
                      <div className={loading ? "loading active" : "loading"}>
                        <i className="icon">
                          <Loading fill="currentColor" />
                        </i>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => loadMore()}
                      className="btn btn-loademore bg-white"
                    >
                      {loading ? (
                        <b>
                          <Loading fill="currentColor" /> Loading Packages{" "}
                        </b>
                      ) : (
                        <b>Load More Packages</b>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
