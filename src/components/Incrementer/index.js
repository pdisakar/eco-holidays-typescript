import { Minus, Plus } from "lucide-react";
export default function Incrementer({
  min,
  max,
  number,
  increment,
  decrement,
}) {
  return (
    <div className="increment_decrement min-w-[142px] flex-wrap justify-center w-fit font-bold flex items-center [&>.handler]:border [&>.handler]:border-border [&>.handler]:bg-wgite [&>.handler]:h-10 [&>.handler]:flex-[0_0_40px] [&>.handler]:w-10 [&>.handler]:inline-flex [&>.handler]:items-center [&>.handler]:justify-center
    hover:[&>.handler]:bg-primary hover:[&>.handler]:text-white hover:[&>.handler]:border-primary disabled:[&>.handler]:cursor-default disabled:[&>.handler]:bg-white disabled:[&>.handler]:text-headings/50 disabled:[&>.handler]:border-border disabled:[&>.handler]:bg-primary/5">
      <button
        type="button"
        className="handler decrement rounded-l-md"
        onClick={() => decrement()}
        disabled={number <= min}
      >
        <i className="icon">
          <Minus fill="currentColor" />
        </i>
      </button>
      <input value={number} readOnly className="border -m-[1px] border-border h-10 text-center max-w-16 flex-[0_0_64px]" />
      <button
        className="handler increment rounded-r-md"
        type="button"
        onClick={() => increment()}
        disabled={number >= max}
      >
        <i className="icon">
          <Plus fill="currentColor" />
        </i>
      </button>
    </div>
  );
}
