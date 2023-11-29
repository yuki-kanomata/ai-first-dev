/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: `class`,
  theme: {
    fontSize: {
      xs: ['0.625rem', '0.77rem'],
      sm: ['0.75rem', '1rem'],
      base: ['0.875rem', '1.25rem'],
      lg: ['1rem', '1.5rem'],
      xl: ['1.125rem', '1.75rem'],
      '2xl': ['1.25rem', '1.75rem'],
      '3xl': ['1.5rem', '2rem'],
      '4xl': ['1.875rem', '2.25rem'],
      '5xl': ['2.25rem', '2.5rem'],
    },
    fontFamily: {
      sans: [
        // NOTE: Backend側に同様の指定があるため、変更する場合は一緒に変更すること
        // スペースを含むフォント名はquoteが必要
        // https://tailwindcss.com/docs/font-family#customizing-your-theme
        '"Helvetica Neue"',
        '"Segoe UI"',
        '"ヒラギノ角ゴ ProN"',
        '"Hiragino Kaku Gothic ProN"',
        'メイリオ',
        'Meiryo',
        'sans-serif',
      ],
    },
    extend: {
    },
  },
  plugins: [],
}