import { BASE_URL } from '@/lib/constants';
import dynamic from 'next/dynamic';
const PageBanner = dynamic(() => import('../../Banners/PageBanner'));
const Breadcrumb = dynamic(() => import('../../Breadcrumb'));
import Link from 'next/link';

interface Media {
  full_path: string;
  alt_text?: string | null;
}

interface ArticleChildItem {
  id: number;
  page_title: string;
  page_description: string;
  urlinfo: {
    url_slug: string;
  };
}

interface ArticleContent {
  page_title: string;
  page_description: string;
  urlinfo: {
    url_slug: string;
  };
  banner?: Media | null;
  children?: ArticleChildItem[];
}

interface BreadcrumbItem {
  slug: string;
  title: string;
}

interface ArticleProps {
  data: {
    content: ArticleContent;
    breadcrumbs?: Record<string, { url_slug: string; title: string }> | null;
  };
}


function limitWords(text: string, wordLimit: number): string {
  if (!text || typeof text !== 'string') return '';

  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) {
    return text;
  }
  return words.slice(0, wordLimit).join(' ') + '...';
}

export default function Article({ data }: ArticleProps) {
  const { page_title, page_description, urlinfo, banner, children } =
    data.content;

  const breadcrumbs = data?.breadcrumbs;

  const breadcrumbsData: BreadcrumbItem[] | undefined = breadcrumbs
    ? Object.keys(breadcrumbs).map(key => ({
        slug: breadcrumbs[key].url_slug,
        title: breadcrumbs[key].title,
      }))
    : undefined;

  return (
    <>
      {banner && (
        <PageBanner
          renderData={banner}
          pageTitle={page_title}
        />
      )}

      <section className="common-box pb-0 pt-0">
        <div className="container">
          <div className="lg:w-9/12 mx-auto">
            <div className="page-title mt-10 mb-6">
              <Breadcrumb
                data={breadcrumbsData}
                currentPage={page_title}
                classes="mb-1.5"
              />
              <h1>{page_title}</h1>
            </div>

            <article
              className="common-module"
              dangerouslySetInnerHTML={{
                __html: page_description,
              }}></article>

            {children && children.length > 0 && (
              <ul className="grid grid-cols-3 gap-6 common-module">
                {children.map((item, idx) => {
                  const text = limitWords(item.page_description, 20);
                  return (
                    <li key={item.id}>
                      <div className="item">
                        <h3 className="text-[1.25rem] mb-3 flex gap-x-3">
                          <span className="bg-primary/20 flex-[0_0_32px] text-center leading-[32px] text-[1.125rem] h-8 w-8 inline-block rounded-full font-bold text-primary">
                            {idx + 1}
                          </span>
                          <span className="font-bold pt-1 text-headings">
                            {item.page_title}
                          </span>
                        </h3>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: text,
                          }}
                          className="text-md text-headings/80"></div>

                        <Link
                          className="font-semibold inline-block capitalize mt-3 text-sm text-primary text-pretty tracking-wide  hover:uderline hover:decoration-primary group"
                          href={BASE_URL + item.urlinfo.url_slug}>
                          Explore
                          <svg className="h-3 w-[0] transition-all inline-block ml-1 group-hover:w-3">
                            <use
                              xlinkHref="/icons.svg#arrow-short-right"
                              fill="currentColor"
                            />
                          </svg>
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
