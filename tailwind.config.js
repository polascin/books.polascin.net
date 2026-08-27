/** @type {import('tailwindcss').Config} */
// Mirrors the inline config that cdn.tailwindcss.com used to receive, so the
// locally built stylesheet renders identically to the previous CDN output.
module.exports = {
  content: [
    './*.php',
    './includes/**/*.php',
    './assets/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f4f1ea',
        ink: '#1e293b',
      },
    },
  },
  plugins: [],
};
