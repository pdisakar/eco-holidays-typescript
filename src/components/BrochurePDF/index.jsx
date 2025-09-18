import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Path,
} from "@react-pdf/renderer";
import { parse } from "node-html-parser";
import React from "react";

const LOGO_URL = "https://www.ecoholidaysnepal.com/logo.png";

const CheckIcon = () => (
  <Svg viewBox="0 0 16 16" width="12" height="12">
    <Path
      d="M6.173 13.577a.75.75 0 0 1-1.06 0l-3.69-3.69a.75.75 0 1 1 1.06-1.06l3.16 3.16 7.16-7.16a.75.75 0 1 1 1.06 1.06l-7.69 7.69z"
      fill="green"
    />
  </Svg>
);

const UncheckIcon = () => (
  <Svg viewBox="0 0 16 16" width="12" height="12">
    <Path
      d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1z"
      stroke="red"
      strokeWidth="2"
      fill="none"
    />
    <Path d="M5 5l6 6M11 5l-6 6" stroke="red" strokeWidth="2" />
  </Svg>
);

const styles = StyleSheet.create({
  page: { paddingTop: 60, paddingBottom: 60, paddingHorizontal: 30 },
  section: { marginBottom: 10 },
  title: { fontSize: 22, marginBottom: 20, fontWeight: "bold" },
  subtitle: { fontSize: 16, marginBottom: 10, fontWeight: "bold" },
  heading: { fontSize: 14, marginBottom: 5, fontWeight: "bold" },
  subheading: { fontSize: 12, marginBottom: 10, opacity: 0.8 },
  paragraph: {
    fontSize: 12,
    marginBottom: 0,
    lineHeight: 1.7,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 0,
    lineHeight: 1.4,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
    gap: 0,
  },
  icon: {
    width: 12,
    height: 12,
    marginRight: 4,
  },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
  underline: { textDecoration: "underline" },
  link: {
    color: "#14bf60",
    textDecoration: "underline",
  },
  image: { width: "100%", height: "auto", marginBottom: 10 },
  header: {
    position: "absolute",
    top: 20,
    left: 30,
    right: 30,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: "center",
    color: "#888",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderTop: "1px solid #ccc",
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: 1,
    fontSize: 50,
    color: "#000",
    textAlign: "center",
  },
  wimage: {
    width: 233,
    height: 60,
    marginBottom: 10,
    opacity: 0.1,
    transform: "rotate(-30deg)",
    marginLeft: "auto",
    marginRight: "auto",
  },
  smallText: {
    fontSize: 10,
    textAlign: "center",
    color: "#888",
  },
});

// Helper to render HTML nodes, with icon support for includes/excludes
function renderHtmlNode(node, opts = {}) {
  if (node.nodeType === 3) {
    // Text node
    return <Text>{node.rawText}</Text>;
  }

  switch (node.tagName) {
    case "P":
      return (
        <Text style={styles.paragraph}>
          {node.childNodes.map((n, i) => (
            <React.Fragment key={i}>{renderHtmlNode(n, opts)}</React.Fragment>
          ))}
        </Text>
      );
    case "B":
    case "STRONG":
      return (
        <Text style={styles.bold}>
          {node.childNodes.map((n, i) => (
            <React.Fragment key={i}>{renderHtmlNode(n, opts)}</React.Fragment>
          ))}
        </Text>
      );
    case "I":
    case "EM":
      return (
        <Text style={styles.italic}>
          {node.childNodes.map((n, i) => (
            <React.Fragment key={i}>{renderHtmlNode(n, opts)}</React.Fragment>
          ))}
        </Text>
      );
    case "U":
      return (
        <Text style={styles.underline}>
          {node.childNodes.map((n, i) => (
            <React.Fragment key={i}>{renderHtmlNode(n, opts)}</React.Fragment>
          ))}
        </Text>
      );
    case "A":
      return (
        <Text style={styles.link}>
          {node.childNodes.map((n, i) => (
            <React.Fragment key={i}>{renderHtmlNode(n, opts)}</React.Fragment>
          ))}
        </Text>
      );
    case "UL":
    case "OL":
      return (
        <View>
          {node.childNodes.map((n) =>
            renderHtmlNode(n, { ...opts, isList: true, icon: opts.icon })
          )}
        </View>
      );
    case "LI":
      return (
        <View style={styles.listItem} wrap={false}>
          {opts.icon && (
            <View style={{ marginRight: 4 }}>
              {opts.icon === "check" ? <CheckIcon /> : <UncheckIcon />}
            </View>
          )}
          <Text style={{ flex: 1 }}>
            {node.childNodes.map((n, i) => (
              <React.Fragment key={i}>{renderHtmlNode(n, opts)}</React.Fragment>
            ))}
          </Text>
        </View>
      );
    case "BR":
      return <Text>{"\n"}</Text>;
    default:
      return (
        <Text>
          {node.childNodes && node.childNodes.length
            ? node.childNodes.map((n, i) => (
                <React.Fragment key={i}>
                  {renderHtmlNode(n, opts)}
                </React.Fragment>
              ))
            : node.rawText}
        </Text>
      );
  }
}

// Removed unused Header component

const Footer = () => (
  <View style={styles.footer} fixed>
    <Text style={styles.smallText}>
      &copy; {new Date().getFullYear()} {process.env.COMPANY_NAME}. All rights
      reserved.
    </Text>
    <Text
      render={({ pageNumber, totalPages }) =>
        `Page ${pageNumber} of ${totalPages}`
      }
      fixed
    />
  </View>
);

const Watermark = () => (
  <View style={styles.watermark} fixed>
    <Image src={LOGO_URL} style={styles.wimage} />
  </View>
);

function renderListWithIcon(html, type) {
  if (!html) return null;
  const root = parse(html);
  return root.childNodes.map((node, i) => renderHtmlNode(node, { icon: type }));
}

export default function BrochurePDF({ data }) {
  const { title, duration, duration_type, package_details, itinerary, package_cost_includes, package_cost_excludes} =
    data;
  const description = parse(package_details);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Footer />
        <Watermark />

        <View>
          <Image
            src={LOGO_URL}
            style={{ width: 233, height: 60, margin: "0 0 15 0" }}
          />
        </View>

        <View>
          <Text style={styles.title}>
            {title +
              " - " +
              duration +
              " " +
              (duration_type === "days" ? "Days" : "Hrs")}
          </Text>
        </View>
        <View style={styles.section}>
          {description.childNodes.map((node, i) => (
            <React.Fragment key={i}>{renderHtmlNode(node)}</React.Fragment>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Itinerary</Text>
          {itinerary.map((item, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.heading}>
                {duration_type === "days" ? "Day " : ""}
                {item.itinerary_day <= 9
                  ? "0" + item.itinerary_day
                  : item.itinerary_day}
                {": "}
                {item.itinerary_title}
              </Text>
              <View>
                {item.itinerary_description &&
                  parse(item.itinerary_description).childNodes.map(
                    (node, i) => (
                      <React.Fragment key={i}>
                        {renderHtmlNode(node)}
                      </React.Fragment>
                    )
                  )}
              </View>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Cost Details</Text>
          <View style={styles.section}>
            <Text style={styles.heading}>What&apos;s Included</Text>
            {renderListWithIcon(package_cost_includes, "check")}
            <Text style={styles.heading}>What&apos;s Not Included</Text>
            {renderListWithIcon(package_cost_excludes, "uncheck")}
          </View>
        </View>
      </Page>
    </Document>
  );
}



