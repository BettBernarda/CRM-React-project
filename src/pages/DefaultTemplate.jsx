import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "../components/ResponsiveAppBar";

export default function DefaultTemplate() {
    const theme = createTheme({
      colorSchemes: {
        dark: true,
      }
    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ResponsiveAppBar></ResponsiveAppBar>
        <Outlet></Outlet>
      </ThemeProvider>
    )
}