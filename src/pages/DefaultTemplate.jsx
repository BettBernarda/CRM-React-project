import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import PathBreadcrumbs from "../components/PathBreadcrumbs";
import { SnackbarProvider } from "notistack";

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
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
          <div className="m-4">
            <div className="mb-4">
              <PathBreadcrumbs></PathBreadcrumbs>
            </div>
            <Outlet />
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    )
}