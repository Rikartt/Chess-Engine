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
const TILECOLOR1 = "#c4c4c4"
const TILECOLOR2 = "#303030"
const imgcache = {} //image cache so it doesnt get super cluttered
class Sprite {
    constructor(width, height, x, y, name, ctx) {
        this.ctx = ctx
        this.width = width
        this.height = height
        this.x = x
        this.y = y
        this.name = name
        this.dragging = false
        if (!imgcache[this.name]) {
            imgcache[this.name] = new Image(this.width, this.height)
            imgcache[this.name].src = `sprites/${this.name}.png`;
            this.image = imgcache[this.name]
        }
        else {
            this.image = imgcache[this.name]
        }
    }
    draw() {
        if (this.image.complete) {
            this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            console.log("drew image")
        } else {
            this.image.addEventListener("load", () => {
            this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }, { once: true });
    }
    }
}
function getTileColor(i, j, color1, color2) {
    if (!((i + j) % 2)) {
                return color1;
            } else {
                return color2;
    }
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
async function readformation(formation) {
    // /public/data.json -> same origin
    const data = await fetch(`formations/${formation}.json`).then(r => r.json());
    console.log(data);
    return data
}
function renderGrid (grid, elementid) {
    var c = document.getElementById(elementid);
    var ctx = c.getContext("2d");
    var dwidth = c.width; var dheight = c.height; //Screen width and height
    var tilewidth = dwidth / grid.length; var tileheight = dheight / grid[0].length; // Tile height and width
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            let tilex = i*tilewidth; let tiley = j*tileheight // x and y coords of top left of current iterated tile.
            ctx.fillStyle = getTileColor(i, j, TILECOLOR1, TILECOLOR2)
            ctx.fillRect(tilex, tiley, tilewidth, tileheight);
            ctx.fillStyle = getTileColor(i, j, TILECOLOR2, TILECOLOR1)
            ctx.fillText(`${mapNumtoLetter[i]}${grid[i].length - j}`, i*tilewidth+10, (j+1)*tileheight-10, 20);
        }
    }
}
let PcsList = [] // Piece object structure {Type, Color, X, Y}
function addPc (type, color, x, y) {
    PcsList.push({type: type, color: color, x: x, y: y, dragging: false})
}
function findPc (x, y) {
    let ismatch = (element) => element.x == x && element.y == y;
    if (PcsList.findIndex(ismatch) != -1) {return PcsList.findIndex(ismatch)} else {return false};
}
function renderPcs(grid, elementid) {
    var c = document.getElementById(elementid);
    var ctx = c.getContext("2d");
    var dwidth = c.width; var dheight = c.height; //Screen width and height
    var tilewidth = dwidth / grid.length; var tileheight = dheight / grid[0].length; // Tile height and width
//    let mouseX = 0;
//    let mouseY = 0;
//    c.addEventListener("mousemove", (e) => {
//        const rect = c.getBoundingClientRect();
//        mouseX = e.clientX - rect.left; // X inside canvas
//        mouseY = e.clientY - rect.top;  // Y inside canvas
//    });
//    c.addEventListener("mousedown", function mousedown(event) {
//        console.log(event)
//        let clickcoords = {x: Math.floor(event.layerX / tilewidth), y: Math.floor(event.layerY / tileheight)}
//        const rect = c.getBoundingClientRect();
//        mouseX = e.clientX - rect.left; // X inside canvas
//        mouseY = e.clientY - rect.top;  // Y inside canvas
//        console.log(clickcoords)
//        if (findPc(clickcoords.x, clickcoords.y)) {
//        PcsList[findPc(clickcoords.x, clickcoords.y)].dragging = true
//        }
//        console.log(PcsList[findPc(clickcoords.x, clickcoords.y)].dragging)
//    })
    for (let i = 0; i<PcsList.length; i++) {
        if (!PcsList[i].dragging) {
        let tempsprite = new Sprite(tilewidth, tileheight, PcsList[i].x * tilewidth, PcsList[i].y * tileheight, PcsList[i].type, ctx)
        tempsprite.draw()
        } else {
            let tempsprite = new Sprite(tilewidth, tileheight, mouseX - tilewidth/2, mouseY -tileheight/2, PcsList[i].type, ctx)
            tempsprite.draw()
        }
    }
}
function setupInput(elementid, grid) {
  const c = document.getElementById(elementid);

  const getMouse = (e) => {
    const rect = c.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  };

  c.addEventListener('mousemove', getMouse);

  c.addEventListener('mousedown', (event) => {
    getMouse(event);
    const tilew = c.width / grid.length;
    const tileh = c.height / grid[0].length;
    const gx = Math.floor(mouseX / tilew);
    const gy = Math.floor(mouseY / tileh);
    const idx = findPc(gx, gy);
    if (idx !== -1) {
      draggingIdx = idx;
      PcsList[idx].dragging = true;
    }
  });

  const endDrag = (event) => {
    if (draggingIdx !== -1) {
      getMouse(event);
      const tilew = c.width / grid.length;
      const tileh = c.height / grid[0].length;
      const nx = Math.max(0, Math.min(grid.length - 1, Math.floor(mouseX / tilew)));
      const ny = Math.max(0, Math.min(grid[0].length - 1, Math.floor(mouseY / tileh)));
      PcsList[draggingIdx].x = nx;
      PcsList[draggingIdx].y = ny;
      PcsList[draggingIdx].dragging = false;
      draggingIdx = -1;
    }
  };

  c.addEventListener('mouseup', endDrag);
  c.addEventListener('mouseleave', endDrag);
}
readformation('starting_formation')
  .then(data => PcsList = data)
  .catch(err => console.error(err));
let maingrid = createGrid(8,8)
console.log(maingrid)
//addPc("K", "Black", 2, 4)
setupInput("maincanvas", maingrid)
function drawAll() {
    renderGrid(maingrid, "maincanvas")
    renderPcs(maingrid, "maincanvas")
    requestAnimationFrame(drawAll)
}
drawAll()