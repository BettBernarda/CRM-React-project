import { enqueueSnackbar } from "notistack"

export const showMessage = (message, variant) => enqueueSnackbar(message, { variant })
export const showMessageSuccess = message => showMessage(message, 'success')