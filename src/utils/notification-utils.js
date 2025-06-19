import { enqueueSnackbar } from "notistack"

export const showMessage = (message, variant) => enqueueSnackbar(message, { variant })
export const showMessageSuccess = message => enqueueSnackbar(message, { variant: 'success' })
export const showMessageError = message => enqueueSnackbar(message, { variant: 'error' })