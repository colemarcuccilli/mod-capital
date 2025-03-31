/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0D1321', // Rich Black
                secondary: '#C957E5', // Poix
                accent: '#FF6666', // Bittersweet
                'accent-secondary': '#C5D86D', // Mindaro
                background: '#FFFFFA', // Baby Powder
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'], // Keep Inter as fallback
                montserrat: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'], // Keep Montserrat as fallback
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