module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["SF Pro Display", "ui-sans-serif", "system-ui"],
        body: ["SF Pro Text", "ui-sans-serif", "system-ui"]
      },
      colors: {
        "apple-gray": "#f5f5f7",
        "apple-dark": "#1d1d1f"
      }
    }
  },
  plugins: []
};
