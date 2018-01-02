export function ga() {
  if (process.env.NODE_ENV === "production") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }
}
