export const trashBox = (e) => {
  let xMax = e.view.innerWidth
  let zoomR = 135 / window.devicePixelRatio

  if (e.clientX > xMax - zoomR && e.clientY < zoomR) {
    document.querySelector('.trash-frame').classList.add('hovered')
  } else {
    document.querySelector('.trash-frame').classList.remove('hovered')
  }
}

export const trashHandler = (e, notesObj) => {
  let zoomR = 135 / window.devicePixelRatio
  let deleteId = e.target.id
  let xMax = e.view.innerWidth
  if (e.clientX > xMax - zoomR && e.clientY < zoomR) {
    for (let i = 0; i < notesObj.length; i++) {
      if (notesObj[i].id === Number(deleteId)) {
        notesObj.splice(i, 1)
      }
    }
  }
  document.querySelector('.trash-frame').classList.remove('hovered')
  return notesObj
}
