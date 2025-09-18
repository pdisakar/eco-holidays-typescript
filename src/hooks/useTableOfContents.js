import { useEffect, useState } from "react";

const useTableOfContents = (htmlString) => {
  const [tocHtml, setTocHtml] = useState(null);
  const [updatedHtml, setUpdatedHtml] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const generateTOC = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const headings = Array.from(doc.querySelectorAll("h2, h3"));
    const toc = [];
    let h2Count = 0;
    let h3Count = 0;

    headings.forEach((heading) => {
      const level = heading.tagName.toLowerCase();

      if (level === "h2") {
        h2Count += 1;
        h3Count = 0;
      } else if (level === "h3") {
        h3Count += 1;
      }

      const sectionIndex =
        level === "h2" ? h2Count : `${h2Count}.${h3Count}`;
      const id = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      heading.id = id;

      toc.push({ level, id, sectionIndex, text: heading.textContent });
    });

    const tocHtml = toc
      .reduce((acc, item) => {
        if (item.level === "h2") {
          acc.push(
            `<li data-id="${item.id}" class="${
              activeId === item.id ? "active" : ""
            }"><a href="#${item.id}"><span class="number">${item.sectionIndex}</span> ${item.text}</a></li>`
          );
        } else if (item.level === "h3") {
          const lastItem = acc[acc.length - 1];
          if (!lastItem?.includes("<ol>")) {
            acc[acc.length - 1] = lastItem?.replace(
              "</li>",
              `<ol><li data-id="${item.id}" class="${
                activeId === item.id ? "active" : ""
              }"><a href="#${item.id}"><span class="number">${item.sectionIndex}</span> ${item.text}</a></li></ol></li>`
            );
          } else {
            acc[acc.length - 1] = lastItem.replace(
              "</ol></li>",
              `<li data-id="${item.id}" class="${
                activeId === item.id ? "active" : ""
              }"><a href="#${item.id}"><span class="number">${item.sectionIndex}</span> ${item.text}</a></li></ol></li>`
            );
          }
        }
        return acc;
      }, [])
      .join("");

    setTocHtml(`<ol>${tocHtml}</ol>`);
    setUpdatedHtml(doc.body.innerHTML);
  };

  useEffect(() => {
    if (!tocHtml) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-50% 0px -50% 0px", // Adjusts when the section is considered active
        threshold: [0],
      }
    );

    const observedElements = Array.from(document.querySelectorAll("h2, h3"));
    observedElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [tocHtml]);

  useEffect(() => {
    generateTOC(htmlString);
  }, [htmlString, activeId]);

  return { tocHtml, updatedHtml };
};

export default useTableOfContents;
