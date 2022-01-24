import React, { Component } from 'react'

import check from '../../assets/check.png'

import './note-item.styles.scss'

class NoteItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMatBoard: this.props.isMatBoard,
      isChecked: this.props.isChecked,
      isTrayDisplay: this.props.isTrayDisplay ?? false,
      id: this.props.id,
    }
  }

  clickHandler = (e) => {
    if (e.target.className === 'note-menu') {
      this.trayPopout(e.target)
    } else {
      if (this.state.isMatBoard) this.props.findMatGroup(e.target.id)
      this.mouseOffset(e)
      if (document.querySelector('#check-toggle').checked === true) {
        this.props.checkHandler(!this.state.isChecked, e.target.id)
        let isChecked = !this.state.isChecked
        this.setState({ isChecked })
      }
    }
  }

  mouseOffset = (e) => {
    const mouseOffsetY =
      e.clientY - parseFloat(getComputedStyle(e.target.parentNode).top)
    const mouseOffsetX =
      e.clientX - parseFloat(getComputedStyle(e.target.parentNode).left)
    this.setState({ mouseOffsetY, mouseOffsetX })
  }

  dragHandler = (e) => {
    const p = this.props
    const s = this.state
    const { width, height } = p
    let xValue = `${e.clientX - s.mouseOffsetX}px`
    let yValue = `${e.clientY - s.mouseOffsetY}px`
    // handling of undefined db values set before feature implementation
    let border = p.border ?? 'none'
    let color = p.noteBColor ?? '#f2ecb3'
    let noteGroup = p.noteGroup ?? []
    let isChecked = p.isChecked ?? false
    let isMatBoard = s.isMatBoard ?? false
    let pUpdate = p.positionUpdater
    let trayText = p.trayText ?? ''
    let trayWidth = p.trayWidth ?? '150px'
    let trayHeight = p.trayHeight ?? '200px'
    let isNew = p.isNew ?? false
    let iframe = p.iframe ?? false

    if (e.clientX !== 0) {
      this.setState(
        {
          left: xValue,
          top: yValue,
          width: width,
          height: height,
          noteText: p.noteText,
          border: border,
          noteBColor: color,
          isChecked: isChecked,
          isMatBoard: isMatBoard,
          noteGroup: noteGroup,
          trayText: trayText,
          trayWidth: trayWidth,
          trayHeight: trayHeight,
          isNew: isNew,
          iframe: iframe
        },
        () => {
          if (this.state.isNew) {
            pUpdate(this.state, e)
          } else {
            isMatBoard
              ? pUpdate(this.state, e, false, [this.state.id, noteGroup, e])
              : pUpdate(this.state, e)
          }
        }
      )
    } else {
      // handles remaining bad clientX value
      console.log(
        'ERROR: dragend/dragover clientX value error. Displaying previously known good position. Error occurs during fast clicking of notes due to client not having time to update. No notes were lost.'
      )
    }
  }

  resizeHandler = (e) => {
    if (e.target.className !== 'note-menu') {
      let width = getComputedStyle(e.target).getPropertyValue('width')
      let height = getComputedStyle(e.target).getPropertyValue('height')
      this.props.resizeHandler(this.state.id, width, height)
      this.setState({
        width: width,
        height: height,
      })
    }
  }

  editHandler = () => {
    this.props.edit(this.state.id)
  }

  displayHandler = () => {
    if (
      (this.state.id <= 4) & (this.state.id !== 0) &&
      this.props.initialDisplay === false
    ) {
      return 'none'
    } else {
      return 'block'
    }
  }

  trayPopout = (target) => {
    let tray = document.querySelector(`#${target.dataset.tray}`)
    let trayArea = document.querySelector(`#${target.dataset.tray} textarea`)
    let id = target.parentNode.parentNode.id
    if (tray.dataset.display === 'false') {
      let isTrayDisplay = true
      this.setState({ isTrayDisplay })
      this.props.trayHandler(isTrayDisplay, id)
      trayArea.style.display = 'block'
      tray.style.display = 'block'
      trayArea.style.width = this.props.trayWidth
      trayArea.style.height = this.props.trayHeight
      tray.dataset.display = 'true'
    } else {
      let isTrayDisplay = false
      this.setState({ isTrayDisplay })
      this.props.trayHandler(isTrayDisplay, id)
      trayArea.style.display = 'none'
      tray.style.display = 'none'
      tray.dataset.display = 'false'
    }
  }

  traySize = (id) => {
    let tray = document.querySelector(`#tray-${id} textarea`)
    let trayWidth = getComputedStyle(tray).getPropertyValue('width')
    let trayHeight = getComputedStyle(tray).getPropertyValue('height')
    this.props.traySize(id, trayWidth, trayHeight)
  }

  iframeSize = (id) => {
    let iframe = document.querySelector(`#iframe-${id}`)
    let frameWidth = getComputedStyle(iframe).getPropertyValue('width')
    let frameHeight = getComputedStyle(iframe).getPropertyValue('height')
    this.props.iframeSize(id, frameWidth, frameHeight)
  }

  saveTray = (id) => {
    let tray = document.querySelector(`#tray-${id} textarea`)
    let trayText = tray.value
    this.setState({ trayText })
    this.props.passTrayText(id, trayText)
  }

  render() {
    const {
      id,
      width,
      height,
      left,
      top,
      noteText,
      zIndex,
      border,
      noteBColor,
      isMatBoard,
      trayText,
      trayWidth,
      trayHeight,
      isTrayDisplay,
      iframe,
      iframeWidth,
      iframeHeight,
    } = this.props

    return (
      <div
        style={{
          zIndex: `${zIndex}`,
          position: 'absolute',
          width: `${width}`,
          height: `${height}`,
          left: `${left}`,
          top: `${top}`,
        }}>
        <div
          style={{
            width: `${width}`,
            height: `${height}`,
            backgroundColor: `${noteBColor ?? '#f2ecb3'}`,
            border: `${border}`,
            zIndex: `2`,
            display: this.displayHandler(),
          }}
          id={id}
          className={`note-comp`}
          onMouseDown={this.clickHandler}
          onMouseUp={this.resizeHandler}
          onDrag={this.dragHandler}
          onDoubleClick={this.editHandler}
          draggable>
          <div className={`content isMat-${isMatBoard}`}>
            <img
              src={check}
              style={{ display: `${this.props.isChecked ? 'block' : 'none'}` }}
              className='note-check'
              alt='checkmark'
            />
            <div className='note-menu' data-tray={`tray-${id}`} />
            <p className='note-text'>{noteText}</p>
          </div>
        </div>
        <div
          style={{
            backgroundColor: `${noteBColor}`,
            display: `${isTrayDisplay ? 'block' : 'none'}`,
          }}
          id={`tray-${id}`}
          className={`note-tray ${
            this.state.isTrayDisplay ? 'slide-out' : 'slide-in'
          }`}
          data-display={isTrayDisplay ?? false}>
          <textarea
            className={`tray-text ${
              this.state.isTrayDisplay ? 'slide-out' : 'slide-in'
            }`}
            style={{
              width: `${trayWidth ?? '150px'}`,
              height: `${trayHeight ?? '200px'}`,
              display: `${isTrayDisplay ? 'block' : 'none'}`,
            }}
            suppressContentEditableWarning={true}
            contentEditable='true'
            onMouseUp={() => this.traySize(id)}
            onChange={() => this.saveTray(id)}
            value={trayText}></textarea>
            {!iframe || <div>{iframe}</div>
              // <iframe id={`iframe-${id}`} style={{ resize: 'both', width: `${iframeWidth}`, height: `${iframeHeight}` }}
              // src={iframe}
              // title='Barrueco'
              // onMouseUp={() => this.iframeSize(id)}
              // loading='lazy'></iframe>
            }
        </div>
      </div>
    )
  }
}

export default NoteItem
