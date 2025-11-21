/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html", "./src/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
    colors: {
      royalBlue: '#1B89D3',
      testRoyalBlue: 'rgba(27,137,211,0.65)',
      royalHoverBlue: 'rgba(27,137,211,0.12)',
      crayola: '#F9F9FB',
      dullGray: '#747474',
      blockWhite: '#FFFFFF',
      fonBlock: '#000000',
      errorText: '#ff3d02',
      green: '#4ab767',
      red: '#D99C88',
      adminColor: 'rgba(27,137,211,0.11)',
      userColor: 'rgba(136,217,159,0.23)',
      banUser: 'rgba(217,156,136,0.11)',
      borderBlock: '#e3e3e3'
    },
    screens: {
      'smLitle': '380px',
      'smLitle2': '446px',
      'sm': '640px',
      'myMd1': '700px',
      'md': '768px',
      'myMd2': '800px',
      'myMd3': '900px',
      'lg': '1024px',
      'xl': '1280px',
      'myXl': '1400px',
      'myXl2': '1510px',
      '2xl': '1536px',
      'test2xl': '1621px',
      'my2xl': '1780px',
      'my3xl': '1900px',
      'my3_2xl': '1903px',
      'my4xl': '1920px',
    },
  },
  plugins: [],
}

