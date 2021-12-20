export const newIdFinder = (stateObj) => {
  let idList = [0]
  if (stateObj.notes.length !== 0) {
    stateObj.notes.forEach((note) => {
      idList.push(note.id)
    })
  }

  return Math.max.apply(null, idList) + 1
}

export const zIndexFinder = async (notesObj, id, isMat = false) => {
  let zList = []

  if (isMat) {
    zList = [-2147483645]
    notesObj.forEach((note) => {
      if (note.isMatBoard === true) {
        zList.push(note.zIndex)
      }
    })
  } else {
    let newIndex = await indexFinder(notesObj, id)
    console.log(newIndex)
    if (notesObj[newIndex].isMatBoard === undefined) {
      zList = [0]
      notesObj.forEach((note) => {
        zList.push(note.zIndex)
      })
    } else if (notesObj[newIndex].isMatBoard === true) {
      zList = [-2147483645]
      notesObj.forEach((note) => {
        if (note.isMatBoard === true) {
          zList.push(note.zIndex)
        }
      })
    } else {
      console.log('zIndexHandler error')
    }
  }
  // NEED conditional to reset index if too large...outlying case, but would stop the stacking ability if maxed.
  // Needs to retain stack order, but reduce zIndexes to a workable range, without taking them below 0
  return Math.max.apply(null, zList) + 1
}

export const indexFinder = (notesObj, id) => {
  let newIndex
  notesObj.forEach((note) => {
    if (note.id === Number(id)) {
      newIndex = notesObj.indexOf(note)
    }
  })

  return newIndex
}
