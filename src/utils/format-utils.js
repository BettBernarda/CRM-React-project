export const formatCurrency = (val) => {
  if (val == null || val == '') {
    return 'R$ 0,00'
  }

  let num;

  if (typeof val === 'number') {
    num = val
  } else {
    const onlyDigits = val.replace(/\D/g, '')
    num = Number(onlyDigits) / 100
  }

  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}