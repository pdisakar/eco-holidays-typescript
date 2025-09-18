import dynamic from "next/dynamic";
const Breadcrumb = dynamic(() => import("../../Breadcrumb"));
const PackageItem = dynamic(() => import("../../PackageItem/Package"));
export default function Region({ data }) {
  const { title, body, packages } = data;
  return (
    <div
      className={!banner ? "container common-box pt-0" : "container common-box"}
      role="main"
    >
      <div className="row">
        <div className="col-xl-10 mx-auto">
          {!banner && (
            <div className="page-title-area">
              <div className="title mb-0">
                <h1>{page_title}</h1>
              </div>
              <Breadcrumb currentPage={page_title} />
            </div>
          )}
        </div>
      </div>
      <div className="common-module category mb-0">
        <div className="title">
          <div className="row">
            <div className="col-lg-9 mx-auto">
              <h2>Available Packages</h2>
            </div>
          </div>
        </div>
        <div className="package-layot__grid-classic">
          <ul className="row">
            {packages?.map((itm, idx) => {
              return (
                <li className="col-lg-4" key={idx}>
                  <PackageItem packageData={itm} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
