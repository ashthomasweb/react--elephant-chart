export const newIdFinder = (stateObj) => {
    let idList = []
    stateObj.notes.forEach((note) => {
      idList.push(note.id)
    })
    return Math.max.apply(null, idList) + 1
}
  
export const zIndexFinder = (notesObj) => {
    let zList = []
    notesObj.forEach((note) => {
      zList.push(note.zIndex)
    })
    // NEED conditional to reset index if too large...outlying case, but would stop the stacking ability if maxed.
    // Needs to retain stack order, but reduce zIndexes to a workable range, without taking them below 0
    return Math.max.apply(null, zList) + 1
}

export const indexFinder = (notesObj, id) => {
    let newIndex
    notesObj.forEach((note) => {
        if (note.id === id) {
          newIndex = notesObj.indexOf(note)
        }
      })

    return newIndex
}
