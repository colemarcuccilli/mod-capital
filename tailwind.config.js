/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#BC0000',
                secondary: '#0F172A',
                accent: '#FF0000',
                background: '#F8FAFC',
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                montserrat: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
        },
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
            },
        },
    },
    plugins: [],
}