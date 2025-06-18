import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import PathBreadcrumbs from "../components/PathBreadcrumbs";

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
        <div className="m-4">
          <PathBreadcrumbs></PathBreadcrumbs>
          <Outlet></Outlet>
        </div>
      </ThemeProvider>
    )
}