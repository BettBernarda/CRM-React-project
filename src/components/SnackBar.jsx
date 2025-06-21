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
        onClick={onClose} // Use onClose prop for closing
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      {/* Remove the "Open Snackbar" button as the parent controls it */}
      {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
      <Snackbar
        open={open} // Use the prop 'open'
        autoHideDuration={2000}
        onClose={onClose} // Use the prop 'onClose'
        message={message} // Use the prop 'message'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        action={action} // Include the action for the close button
      />
    </div>
  );
}