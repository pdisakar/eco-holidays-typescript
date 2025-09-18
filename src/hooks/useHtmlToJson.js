"use client"
import { useEffect, useState } from "react";

const useHtmlToJson = (htmlString) => {
  const [json, setJson] = useState([]);

  useEffect(() => {
    const parseHTML = (htmlString) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");
      return doc.body.children;
    };

    const buildJSON = (elements) => {
      const result = [];
      let currentTitle = null;
      let currentFaqs = [];
      let lastTag = null;
      let titleId = 999;
      let faqId = 0;

      for (let el of elements) {
        if (el.tagName === "H3") {
          if (currentTitle) {
            result.push({
              title: currentTitle,
              id: titleId,
              faq: currentFaqs,
            });
            titleId++;
            faqId = 0; // Reset FAQ ID for new title
          }
          currentTitle = el.textContent;
          currentFaqs = [];
        } else if (el.tagName === "H4") {
          currentFaqs.push({ id: faqId, question: el.textContent, answer: "" });
          faqId++;
          lastTag = "H4";
        } else if (el.tagName === "P") {
          if (lastTag === "H4" || lastTag === "P") {
            if (currentFaqs.length > 0) {
              currentFaqs[currentFaqs.length - 1].answer += el.outerHTML;
            }
          }
          lastTag = "P";
        }
      }

      if (currentTitle) {
        result.push({ id: titleId, title: currentTitle, faq: currentFaqs });
      }

      return result;
    };

    const elements = parseHTML(htmlString);
    const jsonResult = buildJSON(elements);
    setJson(jsonResult);
  }, [htmlString]);

  return json;
};

export default useHtmlToJson;
