/* ============================================================
   tailwind-config.js
   Tailwind Play CDN configuration (must load after the CDN script)
   ============================================================ */
tailwind.config = {
    theme: {
        extend: {
            colors: {
                gold: {
                    400: '#DFBA6A',
                    500: '#C5A059',
                    600: '#A3803C',
                },
                cream: '#FAF7F2',
                dark: '#111111',
                charcoal: '#1C1C1C'
            },
            fontFamily: {
                heading: ['Cinzel', 'serif'],
                body: ['Montserrat', 'sans-serif'],
            }
        }
    }
};
