import { indexFinder } from "../finders/num-finders"

export const getGroupIds = (id, notes) => {

    let newMatId = id
    let newIndex = indexFinder(notes, newMatId)
    let mat = notes[newIndex]
    let groupTop = parseFloat(mat.top)
    let groupBottom = parseFloat(mat.top) + parseFloat(mat.height)
    let groupLeft = parseFloat(mat.left)
    let groupRight = parseFloat(mat.left) + parseFloat(mat.width)
    let noteGroup = []

    notes.forEach((note) => {
      let noteTop = parseFloat(note.top)
      let noteBottom = parseFloat(note.top) + parseFloat(note.height)
      let noteLeft = parseFloat(note.left)
      let noteRight = parseFloat(note.left) + parseFloat(note.width)
      
      const marginCheck = async () => {
        if (noteLeft + 75 > groupLeft & noteRight - 75 < groupRight) {
            await noteGroup.push(note.id)
            return
        }
      }
      
      if (note.isMatBoard) {
        if (noteTop > groupTop & noteBottom - 75 < groupBottom) {
          marginCheck()
        }
      } else {
        if (noteTop > groupTop & noteTop < groupBottom) {
          if (noteLeft > groupLeft & noteLeft < groupRight) {
            noteGroup.push(note.id)
            return
          }
          if (noteRight < groupRight & noteRight > groupLeft ) {
            noteGroup.push(note.id)
            return
          }
        } else if (noteBottom > groupTop & noteBottom < groupBottom) {
          if (noteLeft > groupLeft & noteLeft < groupRight) {
            noteGroup.push(note.id)
            return
          }
          if (noteRight < groupRight & noteRight > groupLeft ) {
            noteGroup.push(note.id)
            return
          }
        }
      }

    })

    return noteGroup
}

