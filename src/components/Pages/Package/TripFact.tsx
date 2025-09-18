import { BASE_URL } from "@/lib/constants";
import { PackageCategory } from "@/types";

function slugify(text: string) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}



const ICONS = {
  destination: "destination",
  duration: "duration",
  grade: "grade",
  style: "activity",
  accommodation: "accommodation",
  altitude: "elevation",
  groupSize: "trekkers",
  bestTime: "best-time",
  transportation: "vehicle",
  meals: "meals",
  language: "languge",
};

const renderItem = (icon: string, title: string, value: string) => (
  <li>
    <div className="item block relative pl-[42px] leading-[1.4]">
      <svg height={32} width={32} className=" text-secondary absolute left-0 top-0">
        <use xlinkHref={`${BASE_URL}icons.svg#${icon}`} fill="currentColor" />
      </svg>
      <span className="info-title block font-medium text-headings mt-2.5 text-xs">
        {title}
      </span>
      <span className="info leading-[1.3] text-secondary block text-base font-semibold">{value}</span>
    </div>
  </li>
);

type additionalFacts = {
  fact_title: string,
  fact_value: string,
  id: number
}

type Props = {

  destination: PackageCategory;
  grade?: PackageCategory;
  style?: PackageCategory;
  transportation?: PackageCategory;
  meals?: PackageCategory;
  accommodation?: PackageCategory;
  package_duration: number,
  package_duration_type: string,
  package_max_altitude: string | null,
  minPeople?: number | null,
  additional_facts?: additionalFacts[],
}

export default function TripFact({
  destination,
  package_duration,
  package_duration_type,
  grade,
  style,
  accommodation,
  package_max_altitude,
  minPeople,
  transportation,
  meals,
  additional_facts = [],
}: Props) {
  return (
    <div className="package-quick-info common-module">
      <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {renderItem(ICONS.destination, "Destination", destination.title)}
        {renderItem(ICONS.duration, "Duration", `${package_duration} ${package_duration_type === "days" ? 'Days' : package_duration_type}`)}
        {grade && renderItem(ICONS.grade, "Grade", grade.title)}
        {style && renderItem(ICONS.style, "Activities", style.title)}
        {accommodation && renderItem(ICONS.accommodation, "Accommodation", accommodation.title)}
        {package_max_altitude &&
          renderItem(ICONS.altitude, "Max. Elevation", `${package_max_altitude}m.`)}
        {minPeople && renderItem(ICONS.groupSize, "Group Size", `Min. ${minPeople} Pax`)}
        {transportation && renderItem(ICONS.transportation, "Vehicle", transportation.title)}
        {meals && renderItem(ICONS.meals, "Meals", meals.title)}

        {additional_facts.map((itm, idx) => {
          const key = itm.fact_title.toLowerCase();
          // const icon = ICONS[key as keyof typeof ICONS] || null;
          const icon = key
            ? (
              <svg height={32} width={32} className=" text-secondary absolute left-0 top-0">
                <use href={`/icons.svg#${slugify(String(key))}`} fill="currentColor" />
              </svg>
            )
            : null;



          return (
            <li key={idx}>
              <div className="item relative pl-[42px] leading-[1.4]">
                {icon && icon}
                <span className="info-title block font-medium text-headings mt-2.5 text-xs">
                  {itm.fact_title}
                </span>
                <span className="info leading-[1.3] text-secondary block text-base font-semibold">{itm.fact_value}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
