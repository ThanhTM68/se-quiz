/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                glass: "rgba(255, 255, 255, 0.1)",
                glassHover: "rgba(255, 255, 255, 0.15)",
                glassBorder: "rgba(255, 255, 255, 0.2)",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"], // Font dễ đọc
            },
        },
    },
    plugins: [],
};
