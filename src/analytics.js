import ReactGA from "react-ga";

const pageview = (url) => {
  if (import.meta.env.PROD) {
    ReactGA.pageview(url);
  }
};

// category and action are required
const logEvent = (category, action, label, value, nonInteraction) => {
  if (import.meta.env.PROD) {
    ReactGA.event({
      category: category,
      action: action,
      label: label,
      value: value,
      nonInteraction: nonInteraction,
    });
  }
};

const makeLogger = (category) => (action, label, value, nonInteraction) =>
  logEvent(category, action, label, value, nonInteraction);

export { pageview, makeLogger };
