
export const trashBox = (e) => {
    let xMax = e.view.innerWidth
    // let yMax = e.view.innerHeight
    if (e.clientX > xMax - 250 && e.clientY < 150) {
      document.querySelector('.trash-frame').classList.add('hovered')
    } else {
      document.querySelector('.trash-frame').classList.remove('hovered')
    }
}

export const trashHandler = (e, notesObj) => {
    let deleteId = e.target.id
    let xMax = e.view.innerWidth
    if (e.clientX > xMax - 250 && e.clientY < 150) {
      for (let i = 0; i < notesObj.length; i++) {
        if (notesObj[i].id === Number(deleteId)) {
          notesObj.splice(i, 1)
        }
      }
    }
    document.querySelector('.trash-frame').classList.remove('hovered')
    return notesObj
}
