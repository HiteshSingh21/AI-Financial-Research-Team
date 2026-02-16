import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0B0E14",
                surface: "#131720",
                "surface-light": "#1A1F2E",
                "surface-hover": "#1E2433",
                border: "#1E2433",
                "border-light": "#2A3040",
                mint: {
                    DEFAULT: "#34D399",
                    light: "#6EE7B7",
                    dark: "#059669",
                    subtle: "rgba(52, 211, 153, 0.1)",
                },
                slate: {
                    text: "#94A3B8",
                    heading: "#E2E8F0",
                    muted: "#64748B",
                },
                danger: "#EF4444",
                warning: "#F59E0B",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "Fira Code", "monospace"],
            },
            backdropBlur: {
                glass: "16px",
            },
            boxShadow: {
                glass: "0 8px 32px rgba(0, 0, 0, 0.4)",
                glow: "0 0 20px rgba(52, 211, 153, 0.15)",
                "glow-lg": "0 0 40px rgba(52, 211, 153, 0.2)",
            },
            animation: {
                "pulse-slow": "pulse 3s ease-in-out infinite",
                "fade-in": "fadeIn 0.5s ease-out",
                "slide-up": "slideUp 0.3s ease-out",
                "slide-in-right": "slideInRight 0.3s ease-out",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideInRight: {
                    "0%": { opacity: "0", transform: "translateX(20px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
