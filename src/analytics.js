import ReactGA from "react-ga";

const pageview = url => {
  if (process.env.NODE_ENV === "production") {
    ReactGA.pageview(url);
  }
};

// category and action are required
const logEvent = (category, action, label, value, nonInteraction) => {
  if (process.env.NODE_ENV === "production") {
    ReactGA.event({ category, action, label, value });
  }
};

const makeLogger = category => (action, label, value, nonInteraction) =>
  logEvent(category, action, label, value, nonInteraction);

export { pageview, makeLogger };
