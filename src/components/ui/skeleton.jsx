function Skeleton({ className, ...props }) {
  return (
    <div className={"animate-pulse rounded" + " " + className} {...props} />
  );
}

export default function PackageSkeleton(){
  return(
      <>
          <figure className="rounded-sm overflow-hidden">
              <Skeleton className="pt-[77.7777778%] block bg-primary/10" />
          </figure>
          <figcaption className="pt-6 px-2.5">
              <Skeleton className="h-[30px] w-full block bg-primary/10 rounded-sm" /> 
              <Skeleton className="h-[20px] w-2/4 block mt-1 mb-3/ bg-primary/10 rounded-sm" /> 
              <Skeleton className="h-[30px] w-3/4 block bg-primary/10" /> 
          </figcaption>

      </>
  )
}

export function MobileHeaderSkeleton({}) {
  return (
    <div className="flex justify-between items-center px-3 py-[15.5px]">
      <span className="animate-pulse rounded-sm bg-light w-[165px] h-[54.94px]"></span>
      <span className="flex items-center">
        <i className="animate-pulse rounded-md bg-light w-[22px] h-[22px]"></i>
        <i className="animate-pulse rounded-sm bg-light w-[67.88px] h-[24px] ml-4"></i>
      </span>
    </div>
  );
}

export function NotificationSkeleton() {
  return (
    <div className="flex justify-center items-center bg-[#0b3c5d] py-2.5 px-3">
      <span className="animate-pulse rounded-full mr-2.5 bg-white/20 w-6 h-6"></span>
      <span className="animate-pulse rounded-sm mr-2.5 bg-white/20 min-w-[350px] h-6"></span>
    </div>
  );
}

export function HomeBannerSkeleton() {
  return (
    <div className="relative block overflow-hidden">
      <Skeleton className="pt-[65.0625%] md:pt-[36.4583333333%] block bg-light" />
    </div>
  );
}

export function PageBannerSkeleton() {
  return (
    <div className="relative block overflow-hidden">
      <Skeleton className="pt-[67.47%] md:pt-[46.0625%] lg:pt-[39.0625%] block bg-light" />
    </div>
  );
}

export function BestSellerPackageSkeleton() {
  return (
    <div className="common-box">
      <div className="container">
        <div className="flex justify-between gap-2 items-center mb-[1.75rem]">
          <div className="w-full">
            <span className="block animate-pulse bg-light h-5 w-2/4 rounded-sm"></span>
            <span className="block h6 mt-1 animate-pulse h-6 w-3/4 bg-light rounded-sm"></span>
          </div>
          <div>
            <div className="swiper-navigation">
              <div className="swiper-button-prev medium radius w-8 h-8 animate-pulse bg-light"></div>
              <div className="swiper-button-next medium radius w-8 h-8-[225px] animate-pulse bg-light"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 lg:gap-6">
          {Array(2)
            .fill()
            .map((idx, index) => {
              return <PackageSkeleton key={index} />;
            })}
        </div>
      </div>
    </div>
  );
}

export function PackagePageSkeletion() {
  return (
    <>
      <PageBannerSkeleton />
      <div className="py-10">
        <div className="container">
          <div className="flex lg:justify-between flex-col lg:flex-row lg:flex-start flex-wrap m-[-0.375rem_-0.75rem]">
            <div className="p-[0.375rem_0.75rem] block lg:flex-[0_0_calc(100%_-_390px)] lg:max-w-[calc(100%_-_390px)]">
              <Skeleton className="h-[21.44px] -mt-5 mb-2 bg-light w-4/6 lg:w-2/6 hidden lg:block" />
              <Skeleton className="h-[35.8px] w-full lg:w-2/5 bg-light block" />
              <Skeleton className="h-[25.44px] mt-1 w-3/6 lg:w-2/6 bg-light block" />
            </div>
            <div className="p-[0.375rem_0.75rem] w-full block lg:mt-5 lg:flex-[0_0_390px] lg:max-w-[390px]">
              <Skeleton className="h-[30.44px] w-2/6 bg-light block" />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="lg:w-[calc(100%_-_400px)]">
          <div className="-mt-6 pb-6 h-[51.19px]">
            <Skeleton className="h-[13px] w-5/6 block bg-light" />
            <Skeleton className="h-[13px] mt-0.5 w-4/6 block bg-light" />
          </div>
          <div>
            <Skeleton className="h-[27.59px] mb-5 block w-1/6 bg-light" />
            <ul className="flex flex-wrap items-center -m-2.5">
              {Array(6)
                .fill()
                .map((index, idx) => {
                  return (
                    <li key={idx} className="w-1/2 lg:w-1/4 p-2.5">
                      <div className="flex items-center">
                        <div className="icon max-w-8 flex-[0_0_32px] h-8 inline-flex">
                          <Skeleton className="block w-full h-full bg-light" />
                        </div>
                        <div className="text pl-2.5 flex-[0_0_calc(100%_-_32px)] max-w-[calc(100%_-_32px)]">
                          <Skeleton className=" h-[15px] w-4/6 block bg-light" />
                          <Skeleton className=" h-[13px] mt-[11.77px] w-5/6  block bg-light" />
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
          <Skeleton className="h-1 w-full block bg-light mt-0.5" />
          <Skeleton className="h-1 w-5/6 block bg-light mt-0.5" />
        </div>
      </div>
    </>
  );
}

export { Skeleton };
