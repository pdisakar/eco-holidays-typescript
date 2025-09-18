export default function OutlineItinerary({ renderData, duration_type }) {
  return (
    <div className="outline-itinerary [&>ul>li+li]:border-t [&>ul>li+li]:border-t-border [&>ul>li+li]:pt-4 [&>ul>li+li]:mt-4 ">
      <ul>
        {renderData.map((itm) => {
          return (
            <li key={itm.id} className="itinerary-title text-base font-medium text-primary flex flex-wrap leading-[1.4]">
              <strong className="text-secondary min-[66px] flex-[0_0_66px]">
              {duration_type === "days" ? "Day " : duration_type}
              {itm.itinerary_day < 10 ? "0" + itm.itinerary_day + ":" : itm.itinerary_day + ":"}
            </strong>
              {itm.itinerary_short_description}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
