interface Props {
    package_cost_includes: string | null;
    package_cost_excludes: string | null;
    package_title?: string;
}
export default function CostDetails({ package_cost_excludes, package_cost_includes, package_title }: Props) {
    return (
        <>
            {package_cost_excludes && package_cost_includes && (
                <div className="package-section ">
                   <div className="common-module">
                     <h2 className="section-title">
                        Cost Details
                    </h2>
                    <h3 className="text-lg mb-3 text-secondary">What's Included in {package_title}</h3>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: package_cost_includes,
                        }}
                        className="text-md font-medium mb-6  leading-[1.5] [&>ul>li+li]:mt-3 [&>ul>li]:relative [&>ul>li]:pl-8 [&>ul>li]:before:h-[18px] [&>ul>li]:before:bg-primary/10 [&>ul>li]:before:border [&>ul>li]:before:border-primary [&>ul>li]:before:rounded-full [&>ul>li]:before:w-[18px]  [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-0.5 [&>ul>li]:before:bg-[length:10px_10px] [&>ul>li]:before:content-[''] [&>ul>li]:before:bg-checkmark [&>ul>li]:before:bg-no-repeat [&>ul>li]:before:bg-center"
                    ></div>
                 
                    <h3 className="text-lg mb-3 text-secondary">What's Excluded in {package_title}</h3>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: package_cost_excludes,
                        }}
                        className="text-md font-medium mb-6  leading-[1.5] [&>ul>li+li]:mt-3 [&>ul>li]:relative [&>ul>li]:pl-8 [&>ul>li]:before:h-[18px] [&>ul>li]:before:bg-danger/10 [&>ul>li]:before:border [&>ul>li]:before:border-danger [&>ul>li]:before:rounded-full [&>ul>li]:before:w-[18px]  [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-0.5 [&>ul>li]:before:bg-[length:10px_10px] [&>ul>li]:before:content-[''] [&>ul>li]:before:bg-uncheckmark [&>ul>li]:before:bg-no-repeat [&>ul>li]:before:bg-center"
                    ></div>
                   </div>
                </div>

            )}
        </>
    );
}