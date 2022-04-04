const getDomainTotal = (domain: Array<Array<Array<boolean>>>) => {
  let sum = 0
  for (let i = 0;  i < domain.length; i++) {
    sum += domain[i].length
  }
  return sum
}

export default class NonogramSolver {
  rowDomains: Array<Array<Array<boolean>>> = []
  colDomains: Array<Array<Array<boolean>>> = []
  knownRows = new Set()
  knownCols = new Set()
  knownIntersections = new Set()
  isSearchingRows = true
  rowLength: number
  colLength: number

  constructor(rowNums: Array<Array<number>>, colNums: Array<Array<number>>, rowLength: number, colLength: number) {
    this.rowLength = rowLength
    this.colLength = colLength
    
    for (let i = 0; i < rowNums.length; i++) {
      let domains = this.generateDomains(rowNums[i], rowLength)
      this.rowDomains.push(domains)
    }
    for (let i = 0; i < colNums.length; i++) {
      let domains = this.generateDomains(colNums[i], colLength)
      this.colDomains.push(domains)
    }
  }
  
  generateDomainHelper(nums: Array<number>, domain: Array<any>, row: Array<boolean>, lastStart: number, lastNum: number, index: number, sum: number, size: number) {
    if (sum === 0) {return domain.push(row)}
    sum -= nums[index]

    let start = 0
    if (lastStart !== -1) {start = lastStart + lastNum + 1}

    let end = size - sum - nums.length + index - nums[index] + 2
    if (start === end) {end += 1}

    for (let i = start; i < end; i++) {
      let row_copy = [...row]
      for (let j = 0; j < nums[index]; j++) {
        row_copy[i + j] = true
      }
      this.generateDomainHelper(nums, domain, row_copy, i, nums[index], index + 1, sum, size)
    }
  }

  generateDomains(nums: Array<number>, size: number) {
    let domain: Array<any> = []
    const reducer = (previousValue: number, currentValue: number) => previousValue + currentValue
    this.generateDomainHelper(nums, domain, new Array(size).fill(false), -1, -1, 0, nums.reduce(reducer), size)
    return domain
  }

  reduceNeighborDomains(knownDomain: Array<boolean>, unknownDomains: Array<Array<Array<boolean>>>, index: number) {
    for (let i = 0; i < knownDomain.length; i++) {
      let value = knownDomain[i]
      if (!value && unknownDomains[i].length > 1 && !this.knownIntersections.has([this.isSearchingRows, index, i])) {
        for (let j = unknownDomains[i].length - 1; j >= 0; j--) {
          if (unknownDomains[i][j][index]) {
            unknownDomains[i].splice(j, 1)
          }
        }
      }
    }
  }

  reduceDomain(domain: Array<Array<boolean>>, index: number, value: boolean) {
    if (domain.length === 1) {return}
    for (let i = domain.length - 1; i >= 0; i--) {
      if (domain[i][index] !== value) {
        domain.splice(i, 1)
      }
    }
  }

  getDomainIntersections(domain: Array<Array<boolean>>, index: number) {
    let intersects: any = []
    for (let i = 0; i < domain[0].length; i++) {
      if (!this.knownIntersections.has([this.isSearchingRows, index, i])) {
        let allTrue = true
        let allFalse = true
        for (let j = 0; j < domain.length; j++) {
          if (!allTrue && !allFalse) {break}
          if (!domain[j][i]) {allTrue = false}
          else {allFalse = false}
        }
        if (allTrue) {intersects.push([i, true])}
        if (allFalse) {intersects.push([i, false])}
      }
    }
    return intersects
  }

  reduceDomains(domainsA: Array<Array<Array<boolean>>>, knownDomainsA: any, domainsB: Array<Array<Array<boolean>>>) {
    for (let i = 0; i < domainsA.length; i++) {
      if (!knownDomainsA.has(i)) {
        if (domainsA[i].length === 1) {
          this.reduceNeighborDomains(domainsA[i][0], domainsB, i)
          knownDomainsA.add(i)
        }

        let intersects = this.getDomainIntersections(domainsA[i], i)
        for (let j = 0; j < intersects.length; j++) {
          let intersect = intersects[j]
          this.reduceDomain(domainsB[intersect[0]], i, intersect[1])
          this.knownIntersections.add([this.isSearchingRows, i, intersect[0]])
        }
      }
    }
  }

  solve() {
    let startTime = performance.now()
    while (this.knownRows.size !== this.rowLength && this.knownCols.size !== this.colLength) {
      let before = getDomainTotal(this.rowDomains) + getDomainTotal(this.colDomains)
      this.reduceDomains(this.rowDomains, this.knownRows, this.colDomains)
      this.isSearchingRows = !this.isSearchingRows

      this.reduceDomains(this.colDomains, this.knownCols, this.rowDomains)
      this.isSearchingRows = !this.isSearchingRows

      if (before === getDomainTotal(this.rowDomains) + getDomainTotal(this.colDomains)) {
        console.log("Unsolvable")
        return false
      }
    }
    let endTime = performance.now()
    console.log(endTime - startTime)
    return true
  }
}