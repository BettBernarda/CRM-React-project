import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import PathBreadcrumbs from "../components/PathBreadcrumbs";
import { SnackbarProvider } from "notistack";
import { UserContext } from "../context";

export default function DefaultTemplate() {
    const theme = createTheme({
      colorSchemes: {
        dark: true,
      }
    });

    return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ResponsiveAppBar />
          <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <div className="m-4">
              <div className="mb-4">
                <PathBreadcrumbs />
              </div>
              <UserContext.Provider value={{ id: localStorage.getItem('userId') ?? null }}>
                <Outlet />
              </UserContext.Provider>
            </div>
          </SnackbarProvider>
        </ThemeProvider>
    )
}