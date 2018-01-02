const ga = () => {
  if (process.env.NODE_ENV === "production") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }
};

// category and action are required
const logEvent = (category, action, label, value) =>
  ga("send", "event", category, action, label, value);

const makeLogger = category => (action, label, value) =>
  logEvent(category, action, label, value);

export { ga, logEvent, makeLogger };
