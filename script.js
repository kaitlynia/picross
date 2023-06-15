window.addEventListener('DOMContentLoaded', event => {
  const body = document.querySelector('#body')
  const title = document.querySelector('#title')
  const newGameButton = document.querySelector('#new-game')
  const columnGuides = document.querySelector('#column-guides')
  const rowGuides = document.querySelector('#row-guides')
  const game = document.querySelector('#game')
  const grid = document.querySelector('#grid')
  const timer = document.querySelector('#timer')
  const solvedText = document.querySelector('#solved')

  const gridWidth = 15
  const gridNumberOfCells = 225

  let cells = []
  let time = 0
  let timerInterval = null
  let mouseMode = 0
  let originX = 0
  let originY = 0

  for (let i = 0; i < gridNumberOfCells; i++) {
    grid.appendChild(document.createElement('div'))
  }

  const hide = el => {
    el.classList.add('hidden')
  }

  const show = el => {
    el.classList.remove('hidden')
  }

  const randomCell = () => {
    return Math.random() < 0.7 ? true : false
  }

  const emptyCellsArray = () => {
    cells = []
  }

  const populateCellsArray = () => {
    for (let i = 0; i < gridNumberOfCells; i++) {
      cells.push(randomCell())
    }
  }

  const clearGridCells = () => {
    for (let cell of grid.children) {
      cell.classList.remove('filled')
      cell.classList.remove('crossed')
      cell.innerHTML = ''
    }
  }

  const evaluateColumnGuides = () => {
    let i = 0;
    let connected = false
    let currentTotal = 0

    for (let columnGuide of columnGuides.children) {
      for (let j = i; j < gridNumberOfCells; j = j + gridWidth) {
        if (cells[j]) {
          currentTotal = currentTotal + 1
          connected = true
        } else if (connected === true) {
          const numberElement = document.createElement('b')
          numberElement.textContent = currentTotal.toString()
          columnGuide.appendChild(numberElement)
          currentTotal = 0
          connected = false
        }
      }

      if (connected === true) {
        const numberElement = document.createElement('b')
        numberElement.textContent = currentTotal.toString()
        columnGuide.appendChild(numberElement)
        currentTotal = 0
        connected = false
      }

      i += 1
    }
  }

  const evaluateRowGuides = () => {
    let i = 0;
    let connected = false
    let currentTotal = 0

    for (let rowGuide of rowGuides.children) {
      for (let j = i; j < i + gridWidth; j = j + 1) {
        if (cells[j]) {
          currentTotal = currentTotal + 1
          connected = true
        } else if (connected === true) {
          const numberElement = document.createElement('b')
          numberElement.textContent = currentTotal.toString()
          rowGuide.appendChild(numberElement)
          currentTotal = 0
          connected = false
        }
      }

      if (connected === true) {
        const numberElement = document.createElement('b')
        numberElement.textContent = currentTotal.toString()
        rowGuide.appendChild(numberElement)
        currentTotal = 0
        connected = false
      }

      i = i + gridWidth
    }
  }

  const regenerateBoard = () => {
    emptyCellsArray()
    populateCellsArray()
    clearGridCells()
    evaluateColumnGuides()
    evaluateRowGuides()
  }

  const startTimer = () => {
    time = 0
    timer.innerHTML = '00:00'
    return setInterval(() => {
      time += 1
      timer.innerHTML = (time / 60).toFixed(0).padStart(2, '0') + ':' + (time % 60).toFixed(0).padStart(2, '0')
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(timerInterval)
  }

  let index = 0;

  [...grid.children].forEach(cell => {
    cell.x = parseInt(index % gridWidth)
    cell.y = parseInt(index / gridWidth)

    cell.addEventListener('mousedown', event => {
      // ignore middle-click
      if (event.button == 1) return

      originX = cell.x
      originY = cell.y

      if (event.button == 0) {
        if (event.target.classList.toggle('filled')) {
          mouseMode = event.target.classList.contains('crossed') ? 3 : 1
          event.target.classList.remove('crossed')
        } else {
          mouseMode = -1
        }
      } else if (event.button == 2) {
        if (event.target.classList.toggle('crossed')) {
          mouseMode = event.target.classList.contains('filled') ? 4 : 2
          event.target.classList.remove('filled')
        } else {
          mouseMode = -2
        }
      }
    })

    // prevent context menu from appearing on right-click
    cell.addEventListener('contextmenu', event => event.preventDefault())

    cell.addEventListener('mouseover', event => {
      if (mouseMode == 0) return

      // get index of cell, if cell is in same column or row as the origin, modify the cell
      let index = [].slice.call(event.target.parentElement.childNodes).indexOf(event.target)
      if (parseInt(index % gridWidth) == originX || parseInt(index / gridWidth) == originY) {
        if (mouseMode == 1) {
          // protected fill (won't fill crossed-out cells)
          if (!event.target.classList.contains('crossed')) {
            event.target.classList.add('filled')
          }
        } else if (mouseMode == -1) {
          // erase
          event.target.classList.remove('filled')
          event.target.classList.remove('crossed')
        } else if (mouseMode == 2) {
          // protected cross-fill (won't cross out filled cells)
          if (!event.target.classList.contains('filled')) {
            event.target.classList.add('crossed')
          }
        } else if (mouseMode == -2) {
          // cross-erase
          event.target.classList.remove('crossed')
        } else if (mouseMode == 3) {
          // fill (bypasses crossed-out check)
          event.target.classList.add('filled')
          event.target.classList.remove('crossed')
        } else if (mouseMode == 4) {
          // cross-fill (bypasses filled check)
          event.target.classList.add('crossed')
          event.target.classList.remove('filled')
        }
      }
    })

    index += 1
  })

  body.addEventListener('mouseup', event => {
    mouseMode = 0

    let index = 0
    for (let cell of [...grid.childNodes]) {
      if (cells[index] != cell.classList.contains('filled')) return
      index++
    }

    hide(game)
    stopTimer()
    show(solvedText)
    show(newGameButton)
  })

  newGameButton.addEventListener('click', event => {
    hide(newGameButton)
    hide(title)
    regenerateBoard()
    show(timer)
    show(game)
    timerInterval = startTimer()
  })
})