import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';

// TODO: MELHORAR ISSO POR FAVOR
export default function BasicBreadcrumbs({ links }) {
  const navigate = useNavigate();
  
  const handleClick = (e, path) => {
    e.preventDefault()
    navigate(path)
  };
  
  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        {Array.from(links.entries()).map(link => {
          if (link[1].selected) {
            return <Typography sx={{ color: 'text.primary' }}>{link[0]}</Typography>
          }
          
          return <Link className='hover:cursor-pointer' underline="hover" color="inherit" onClick={(e) => handleClick(e, link[1].path)}>{link[0]}</Link>
        })}
      </Breadcrumbs>
    </div>
  );
}