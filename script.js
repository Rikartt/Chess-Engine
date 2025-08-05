function createGrid (width, height) {
    let retgrid = []
    for (let i = 0; i<width; i++) {
        retgrid.push([])
        for (let j = 0; j<height; j++) {
            retgrid[i].push("-")
        }
    }
    return retgrid
}
function renderGrid (grid, elementid) {
    var c = document.getElementById(elementid);
    var ctx = c.getContext("2d");
    var dwidth = c.width; var dheight = c.height; //Screen width and height
    var tilewidth = dwidth / grid.length; var tileheight = dheight / grid[0].length; // Tile height and width
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (!((i + j) % 2)) {
                ctx.fillStyle = "white";
            } else {
                ctx.fillStyle = "black";
            }
            ctx.fillRect(i*tilewidth, j*tileheight, tilewidth, tileheight);
        }
    }
}
let maingrid = createGrid(8,8)
console.log(maingrid)
renderGrid(maingrid, "maincanvas")