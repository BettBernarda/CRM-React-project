import { enqueueSnackbar } from "notistack"

export const showMessageSuccess = message => {
  enqueueSnackbar(message, { variant: 'success' })
}