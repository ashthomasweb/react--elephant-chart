
export const trashBox = (e) => {
    let xMax = e.view.innerWidth
    let yMax = e.view.innerHeight
    if (e.clientX > xMax - 250 && e.clientY > yMax - 250) {
      document.querySelector('.trash-frame').classList.add('hovered')
    } else {
      document.querySelector('.trash-frame').classList.remove('hovered')
    }
}

export const trashHandler = (e, stateObj) => {
    let deleteId = e.target.id
    let xMax = e.view.innerWidth
    let yMax = e.view.innerHeight
    if (e.clientX > xMax - 250 && e.clientY > yMax - 250) {
      for (let i = 0; i < stateObj.length; i++) {
        if (stateObj[i].id === Number(deleteId)) {
          stateObj.splice(i, 1)
        }
      }
    }
    document.querySelector('.trash-frame').classList.remove('hovered')
    return stateObj
}
