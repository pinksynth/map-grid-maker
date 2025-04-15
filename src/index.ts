type CellValue = boolean
type IndexAndCellValue = [number, CellValue]

const getUp = (
  map: boolean[],
  width: number,
  index: number
): IndexAndCellValue | undefined => {
  const upIndex = index - width
  return upIndex < 0 ? undefined : [upIndex, map[upIndex]]
}

const getDown = (
  map: boolean[],
  width: number,
  index: number
): IndexAndCellValue | undefined => {
  const downIndex = index + width
  return downIndex >= map.length ? undefined : [downIndex, map[downIndex]]
}

const getLeft = (
  map: boolean[],
  width: number,
  index: number
): IndexAndCellValue | undefined => {
  if (index % width === 0) return undefined

  const leftIndex = index - 1
  return [leftIndex, map[leftIndex]]
}

const getRight = (
  map: boolean[],
  width: number,
  index: number
): IndexAndCellValue | undefined => {
  if (index % width === width - 1) return undefined

  const rightIndex = index + 1
  return [rightIndex, map[rightIndex]]
}

const mapFromDims = async (
  width: number,
  height: number,
  density: number,
  runs: number = 1,
  scatter: number = 0.1
) => {
  const map: boolean[] = []
  for (let y = 0; y < height; y++) {
    if (y === 0 || y === height - 1) {
      // Top and bottom edges are filled
      for (let x = 0; x < width; x++) {
        map.push(true)
      }
    } else {
      for (let x = 0; x < width; x++) {
        // Left and right edges are filled
        if (x === 0 || x === width - 1) {
          map.push(true)
        } else {
          map.push(false)
        }
      }
    }
  }

  for (let run = 0; run < runs; run++) {
    // This is a map of change that will be made to the map. We don't make them directly on the map because we don't want it to mutate as we're iterating over it.
    const changes = map.map(() => false)

    for (let i = 0; i < map.length; i++) {
      const availableAdjacentCells = [getUp, getRight, getDown, getLeft]
        .map((fn) => fn(map, width, i))
        .filter((cell) => cell !== undefined && cell[1] === false)

      const cellToFill =
        availableAdjacentCells[
          Math.floor(Math.random() * availableAdjacentCells.length)
        ]

      const meetsDensity = Math.random() < density
      // const meetsScatter = run === 0 || Math.random() < scatter
      const isIsland = availableAdjacentCells.length === 4
      const preventIslandsOnSubsequentRuns = run === 0 || !isIsland
      if (cellToFill && meetsDensity && preventIslandsOnSubsequentRuns)
        changes[cellToFill[0]] = true
    }

    for (let i = 0; i < map.length; i++) {
      if (changes[i]) map[i] = true
    }

    await new Promise((resolve) => setTimeout(resolve, 100))
    console.clear()
    renderMap(map, width, height)
  }
}
const renderMap = (map: boolean[], width: number, height: number) => {
  for (let y = 0; y < height; y++) {
    let line = ""
    for (let x = 0; x < width; x++) {
      line += map[y * width + x] ? "X" : " "
    }
    console.log(line)
  }
}

mapFromDims(60, 20, 0.01, 50, 0.1)
console.log("")
// mapFromDims(30, 10, 0.03, 5)
// console.log("")
// mapFromDims(30, 10, 0.05, 5)
// console.log("")
// mapFromDims(30, 10, 0.07, 5)
// console.log("")
// mapFromDims(30, 10, 0.09, 5)
