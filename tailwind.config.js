/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1E3A8A',
                secondary: '#0F172A',
                accent: '#3B82F6',
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