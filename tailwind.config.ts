// tailwind.config.ts
import type { Config } from 'tailwindcss'; // Esta linha exige que seja .ts

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/lib/**/*.js',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        // --- AS TUAS CORES PERSONALIZADAS VÃO AQUI ---
        'primary-brand': '#3498db',    // Substitui pelo teu azul principal
        'secondary-brand': '#2ecc71',  // Substitui pelo teu verde secundário
        'accent-brand': '#e67e22',     // Substitui pelo teu laranja de destaque
        // --- FIM DAS TUAS CORES PERSONALIZADAS ---
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};

export default config; // Esta linha exige que seja .ts