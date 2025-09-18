/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{js,ts,jsx,tsx,mdx, scss}",
  ],
  theme: {
    container: {
      center: true,
      padding: ".9375rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1230px",
      },
    },
    extend: {
      backgroundImage: {
        mountain: "url('/mountain.png')",
        cross: "url('/bg-top.png')",
        range: "url('/range.svg')",
        "footer-mountain": "url('/bg-footer.png')",
        buddha: "url('/buddha.svg')",
        checkmark: "url('/checkmark.svg')",
        uncheckmark: "url('/uncheckmark.svg')",
        camera: "url('/camera.png')",
        plane: "url('/plane.png')",
        activity: "url('/activity.png')",
        footerimage: "url('/pattern.png')",
        'chevron': "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20fill='none'%20stroke='currentColor'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='2'%20aria-hidden='true'%20class='lucide%20lucide-chevron-down%20h-4%20w-4%20shrink-0%20text-muted-foreground%20transition-transform%20duration-200'%20viewBox='5%208%2014%208'%3E%3Cpath%20d='m6%209%206%206%206-6'%3E%3C/path%3E%3C/svg%3E"
      },
      dropShadow: {
        'base': '0px 10px 20px rgba(5, 32, 49, 0.1)',
      },
      colors: {
        white: "#ffffff",
        primary: "#008f3c",
        'primary-100': "#26a059",
        secondary: "#004956",
        headings: "#082428",//#032139
        navbar: "#012645",
        body: "#313137", //"#012C3F",
        border: "#cfd8e0",
        muted: "#6c757d",
        footer: "#313137",
        "body-bg": "#FFFFFF",
        light: "#E3E8E5",
        "light-500": "#f9fbff",
        success: "#1cb386",
        warning: "#f3893b",
        danger: "#dc3545",
        facebook: "#3b5999",
        twitter: "#14171A",
        google: "#DB4337",
        instagram: "#d02971",
        pinterest: "#bd081c",
        youtube: "#cd201f",
        tiktok: "#010101",
        linkedin: "#0e76a8",
        tripadvisor: "#35E0A1",
        trustpilot: "#00B67A",
        whatsapp: "#25D366",
        monochromatic: "#00DD8C",
        titlecolor: "#2B2945",
        graytext: "#7A8D94",
        pagebg: "#EEF6F4",
        bordercolor: "#dfdfeb",
        graybg: "#F0F1F1",
      },
      borderRadius: {
        sm: "2px",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "gradient-x": {
          "0%": {
            transform: "translate3d(-30%, 0, 0)",
          },
          "100%": {
            transform: "translate3d(30%, 0, 0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-x": "gradient-x 0.8s linear infinite",
      },
      fontFamily: {
        primary: ["var(--primary)"],
        secondary: ["var(--secondary)"],
      },
      fontSize: {
        xxs: ".75rem",
        xs: ".8375rem",
        sm: "0.875rem",
        md: "0.9375rem",
        base: "1rem",
        lg: "1.25rem",
        xl: "1.375rem",
        "2xl": "1.563rem",
        "3xl": "1.8375rem",
        "4xl": "2.441rem",
        "5xl": "3.052rem",
      },
      backgroundSize: {
        auto: "auto",
        cover: "cover",
        contain: "contain",
        "50%": "50%",
        "100%": "100%",
      },
      lineHeight: {
        heading: "1.1",
        base: "1.6",
      },
      boxShadow: {
        base: "0 1px 2px rgba(11,60,93,.4), 0 -1px 2px rgba(11,60,93,.04)",
      },
      listStyleImage: {},
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
