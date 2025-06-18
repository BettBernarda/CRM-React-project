import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PathBreadcrumbs() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const findPaths = () => {
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

    return pathsByTitle
  }
  
  const handleClick = (e, path) => {
    e.preventDefault()
    navigate(path)
  };
  
  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        {Array.from(findPaths().entries()).map(link => {
          if (link[1].selected) {
            return <Typography sx={{ color: 'text.primary' }}>{link[0]}</Typography>
          }
          
          return <Link className='hover:cursor-pointer' underline="hover" color="inherit" onClick={(e) => handleClick(e, link[1].path)}>{link[0]}</Link>
        })}
      </Breadcrumbs>
    </div>
  );
}