// Tailwind CSS Configuration for GenTeck Technology
// This file contains the custom Tailwind configuration

const tailwindConfig = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                dark: {
                    100: '#0F172A',
                    200: '#1E293B',
                    300: '#334155',
                },
                cyber: {
                    blue: '#00F0FF',
                    purple: '#7B2CBF',
                    pink: '#FF2D75'
                }
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'fadeIn': 'fadeIn 0.8s ease forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                fadeIn: {
                    'from': { opacity: 0, transform: 'translateY(20px)' },
                    'to': { opacity: 1, transform: 'translateY(0)' },
                }
            }
        }
    }
};

// Initialize Tailwind with custom config if CDN is being used
if (typeof tailwind !== 'undefined') {
    tailwind.config = tailwindConfig;
}

// Export config for build tools
if (typeof module !== 'undefined' && module.exports) {
    module.exports = tailwindConfig;
}
