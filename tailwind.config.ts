import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "t-sm": "0 -1px 2px 0 rgba(0, 0, 0, 0.05)",
        "t-md":
          "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "t-lg":
          "0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "t-xl":
          "0 -20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "t-2xl": "0 -25px 50px -12px rgba(0, 0, 0, 0.25)",
        "t-3xl": "0 -35px 60px -15px rgba(0, 0, 0, 0.3)",
        "b-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "b-md":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
        "b-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)",
        "b-xl":
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 -10px 10px -5px rgba(0, 0, 0, 0.04)",
        "b-2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "b-3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
        "l-sm": "-1px 0 2px 0 rgba(0, 0, 0, 0.05)",
        "l-md":
          "-4px 0 6px -1px rgba(0, 0, 0, 0.1), 2px 0 4px -1px rgba(0, 0, 0, 0.06)",
        "l-lg":
          "-10px 0 15px -3px rgba(0, 0, 0, 0.1), 4px 0 6px -2px rgba(0, 0, 0, 0.05)",
        "l-xl":
          "-20px 0 25px -5px rgba(0, 0, 0, 0.1), 10px 0 10px -5px rgba(0, 0, 0, 0.04)",
        "l-2xl": "-25px 0 50px -12px rgba(0, 0, 0, 0.25)",
        "l-3xl": "-35px 0 60px -15px rgba(0, 0, 0, 0.3)",
        "r-sm": "1px 0 2px 0 rgba(0, 0, 0, 0.05)",
        "r-md":
          "4px 0 6px -1px rgba(0, 0, 0, 0.1), -2px 0 4px -1px rgba(0, 0, 0, 0.06)",
        "r-lg":
          "10px 0 15px -3px rgba(0, 0, 0, 0.1), -4px 0 6px -2px rgba(0, 0, 0, 0.05)",
        "r-xl":
          "20px 0 25px -5px rgba(0, 0, 0, 0.1), -10px 0 10px -5px rgba(0, 0, 0, 0.04)",
        "r-2xl": "25px 0 50px -12px rgba(0, 0, 0, 0.25)",
        "r-3xl": "35px 0 60px -15px rgba(0, 0, 0, 0.3)",
        "all-sm": "0 0 2px 0 rgba(0, 0, 0, 0.05)",
        "all-md":
          "0 0 6px -1px rgba(0, 0, 0, 0.1), 0 0 4px -1px rgba(0, 0, 0, 0.06)",
        "all-lg":
          "0 0 15px -3px rgba(0, 0, 0, 0.1), 0 0 6px -2px rgba(0, 0, 0, 0.05)",
        "all-xl":
          "0 0 25px -5px rgba(0, 0, 0, 0.1), 0 0 10px -5px rgba(0, 0, 0, 0.04)",
        "all-2xl": "0 0 50px -12px rgba(0, 0, 0, 0.25)",
        "all-3xl": "0 0 60px -15px rgba(0, 0, 0, 0.3)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
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
        "pulse-ring-amber-500": {
          "0%": {
            transform: "scale(0.95)",
            boxShadow: "0 0 0 0 rgba(253, 208, 2, 0.7)",
          },
          "70%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 5px rgba(253, 208, 2, 0)",
          },
          "100%": {
            transform: "scale(0.95)",
            boxShadow: "0 0 0 0 rgba(253, 208, 2, 0)",
          },
        },
        "pulse-ring-red-500": {
          "0%": {
            transform: "scale(0.95)",
            boxShadow: "0 0 0 0 rgba(239, 68, 68, 0.7)",
          },
          "70%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 5px rgba(239, 68, 68, 0)",
          },
          "100%": {
            transform: "scale(0.95)",
            boxShadow: "0 0 0 0 rgba(239, 68, 68, 0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-ring-amber-500": "pulse-ring-amber-500 2s infinite",
        "pulse-ring-red-500": "pulse-ring-red-500 2s infinite",
      },
      gridTemplateColumns: {
        "transaction-row": "repeat(12, minmax(0, 1fr)) 2rem",
        "transaction-row-create": "repeat(12, minmax(0, 1fr)) 2rem 4rem",
        "transaction-row-edit": "repeat(12, minmax(0, 1fr)) 2rem 6rem",
        "transactions-list": "minmax(0, 1fr) 2.625rem 2.625rem minmax(0, 1fr)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;
