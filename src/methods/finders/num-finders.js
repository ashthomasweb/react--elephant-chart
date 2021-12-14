export const newIdFinder = (stateObj) => {
    let idList = []
    stateObj.notes.forEach((note) => {
      idList.push(note.id)
    })
    return Math.max.apply(null, idList) + 1
}

  
export const zIndexFinder = (stateObj) => {
    let zList = []
    stateObj.notes.forEach((note) => {
      zList.push(note.zIndex)
    })
    
    // NEED conditional to reset index if too large...outlying case, but would stop the stacking ability if maxed.
    // if (Math.max.apply(null, zList) > 1000000) {
    //   this.state.notes.forEach((note, i) => {
    //     note.zIndex = note.zIndex - 500000
    //   })
    // }
    // above is too minimal. Needs to retain stack order, but reduce zIndexes to a workable range, without taking them below 0
    
    return Math.max.apply(null, zList) + 1
}