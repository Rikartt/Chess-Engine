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
const mapNumtoLetter = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
  6: "G",
  7: "H",
  8: "I",
  9: "J",
  10: "K",
  11: "L",
  12: "M",
  13: "N",
  14: "O",
  15: "P",
  16: "Q",
  17: "R",
  18: "S",
  19: "T",
  20: "U",
  21: "V",
  22: "W",
  23: "X",
  24: "Y",
  25: "Z"
};
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
            ctx.fillStyle="blue"
            ctx.fillText(`${mapNumtoLetter[i]}${8 - j}`, i*tilewidth+10, (j+1)*tileheight-10, 20)
        }
    }
}
let maingrid = createGrid(8,8)
console.log(maingrid)
maingrid[5][5] = "K"
renderGrid(maingrid, "maincanvas")