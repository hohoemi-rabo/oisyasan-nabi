/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // 立体的医療UI のデザイントークン（DESIGN-GUIDELINES.md §2）。
      // ブランド各色（teal/blue/red/green/amber/pink/purple）は Tailwind 既定が
      // ガイドライン hex とほぼ一致するため上書きせず、不足する面・背景・文字トークンのみ追加。
      colors: {
        bg: '#EEF3F8', // 画面背景（純白にしない＝カードが浮く）
        surface: '#FFFFFF', // カード面
        line: '#E8EEF4', // 極薄の境界線
        ink: {
          DEFAULT: '#0F172A',
          900: '#0F172A',
          700: '#334155',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
        },
      },
    },
  },
  plugins: [],
};
