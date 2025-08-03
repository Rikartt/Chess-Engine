function createGrid (width, height) {
    let retgrid = []
    for (i=0; i++; i<width) {
        retgrid.append([])
        for (j=0; j++; j<height) {
            retgrid[i].append("-")
        }
    }
}