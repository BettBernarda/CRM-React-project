import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function SimpleSnackbar({ open, message, onClose }) {
 

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={onClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Snackbar
        open={open} 
        autoHideDuration={2000}
        onClose={onClose} 
        message={message} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        action={action} 
      />
    </div>
  );
}