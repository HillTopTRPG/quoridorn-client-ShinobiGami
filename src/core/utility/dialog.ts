async function simpleDialog(obj: {
  title: string;
  text?: string;
  icon: 'warning' | 'error' | 'success' | 'info' | 'question';
}): Promise<void> {
  const html = `<div style="text-align: left;">${obj.text?.replaceAll(
    '\n',
    '<br />'
  )}</div>`
  delete obj.text
  await Swal.fire({
    ...obj,
    html
  })
}

export async function errorDialog(obj: {
  title: string;
  text: string;
}): Promise<void> {
  await simpleDialog({
    ...obj,
    icon: 'error'
  })
}

export async function warningDialog(obj: {
  title: string;
  text: string;
}): Promise<void> {
  await simpleDialog({
    ...obj,
    icon: 'warning'
  })
}

export async function successDialog(obj: {
  title: string;
  text: string;
}): Promise<void> {
  await simpleDialog({
    ...obj,
    icon: 'success'
  })
}

export async function questionDialog(obj: {
  title: string;
  text?: string;
  confirmButtonText: string;
  cancelButtonText: string;
}): Promise<boolean> {
  const html = `<div style="text-align: left;">${obj.text?.replaceAll(
    '\n',
    '<br />'
  )}</div>`
  delete obj.text
  const confirm = await Swal.fire({
    ...obj,
    html,
    icon: 'question',
    showCancelButton: true
  })
  return confirm.isConfirmed
}
