import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import BasicBreadcrumbs from "../components/BasicBreadcrumbs";

export default function DefaultTemplate() {
    const theme = createTheme({
      colorSchemes: {
        dark: true,
      }
    });

    const location = useLocation()

    // TODO: MELHORAR ESSE CODIGO E O DE BasicBreadcrumbs PELO AMOR DE 
    const generateBreadcrumbs = () => {
      const splitPath = location.pathname.split('/').filter(e => e).map(e => e[0].toUpperCase() + e.substring(1))
      
      const pathsByTitle = new Map()
      pathsByTitle.set('Home', {
        path: '/',
        selected: location.pathname == '/'
      })
      
      splitPath.forEach((pathTitle, i) => {
        const previousPath = pathsByTitle.get(splitPath[i - 1])?.path ?? ''
        const fullPath = previousPath + '/' + pathTitle.toLowerCase()
        
        pathsByTitle.set(pathTitle, {
          path: fullPath,
          selected: location.pathname == fullPath
        })
      })
      
      return <BasicBreadcrumbs links={pathsByTitle}></BasicBreadcrumbs>
    }

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ResponsiveAppBar></ResponsiveAppBar>
        {generateBreadcrumbs()}
        <Outlet></Outlet>
      </ThemeProvider>
    )
}