import { createTheme } from "@mui/material/styles";

// Match the existing react-md dark theme colors
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9ccc65", // light green - matches $md-primary-color
      light: "#cfff95",
      dark: "#6b9b37",
      contrastText: "#000",
    },
    secondary: {
      main: "#ff5722", // deep orange - matches $md-secondary-color
      light: "#ff8a50",
      dark: "#c41c00",
      contrastText: "#fff",
    },
    background: {
      default: "#303030",
      paper: "#424242",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: "#9ccc65",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: "#9ccc65",
          },
          "&.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#9ccc65",
          },
        },
      },
    },
  },
});

export default theme;
