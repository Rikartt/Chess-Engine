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
//const highlightlist = [] //List of highlighted piece Idx's
const TILECOLOR1 = "#c4c4c4"
const TILECOLOR2 = "#303030"
const GRIDHEIGHT = 8
const GRIDWIDTH = 8
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
            //console.log("drew image")
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
async function readlogic(logic) {
    const data = await fetch(`logic/${logic}.json`).then(r => r.json());
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
let GlobLogic = []
let PcsLogic = {}
function addPc (type, color, x, y) {
    PcsList.push({type: type, color: color, x: x, y: y, dragging: false})
}
function findPc (x, y) {
    let ismatch = (element) => element.x == x && element.y == y;
    if (PcsList.findIndex(ismatch) != -1) {return PcsList.findIndex(ismatch)} else {return false};
}
function GetAllowedSquares (idx, gridwidth, gridheight) { //Takes a piece's idx, determines possible leaps/vectors/captures and checks if said ones are occupied. Returns a list of every possible capture/move in the following structure {captures: [[x,y], ...], moves: [[x,y], ...]}
    let PcType = PcsList[idx].type//Get Piece type
    let PcCapType = PcsLogic[PcType]["capture-type"]
    let PcLogic = PcsLogic[PcType]//Use piece type to pull the logic from the PcsLogic dict
    let PcColor = PcsList[idx].color
    let sx = PcsList[idx].x; let sy = PcsList[idx].y //self x and self y
    let MvList = []
    let CapList = []
    const iswithingrid = (coord) => coord[0] < gridwidth && coord[1] < gridheight && coord[0] >= 0 && coord[1] >= 0; //function that checks if a coordinate is within bounds
    let MvType = PcLogic['move-type']
    let flippedcoefficient = 1 // Needs to be changed to -1 if flipped-for-black = true and color = black
    let retobj = {captures: [], moves: []}
    if (PcLogic['flipped-for-white'] && PcColor == 'white') {
        flippedcoefficient = -1
    }
    if (MvType == "leaper") { // moves for leapers are of course going to be handled differently than for sliders
        for (let i=0;i<PcLogic['vectors'].length;i++) {
           MvList.push(PcLogic['vectors'][i].map(n => flippedcoefficient*n)) //adds vector to MvList but multiplies it with the flippedcoefficient first
        }
        for (let i=0;i<MvList.length;i++) {
            let square = [sx + MvList[i][0],sy + MvList[i][1]]
            let occupier = PcsList[findPc(square[0], square[1])] || null;
            if (iswithingrid(square)) { //checks if coords are within grid
                if (!occupier) { //Pushes the leaps where no piece is to the returnlist
                    retobj['moves'].push(square);
                } else if (occupier['color'] != PcColor && PcCapType == 'same') { //captures for the ones with their capture mode set to same
                    retobj['captures'].push(square);
                }
            }
        }
    } else { // slider logic handling
        for (let i=0;i<PcLogic['vectors'].length;i++) {
            MvList.push(PcLogic['vectors'][i].map(n => flippedcoefficient*n));
        }
        for (let i=0;i<MvList.length;i++) {
            for (let j=1;j<gridwidth;j++) {
                let square = [sx + MvList[i][0]*j,sy + MvList[i][1]*j];
                let occupier = PcsList[findPc(square[0], square[1])] || null;
                if (iswithingrid(square)) { //checks within grid
                    if (!occupier) { //if there isnt a piece on the square
                        retobj['moves'].push(square); //pushes square to moves list
                    } else if (occupier && occupier['color'] != PcColor && PcCapType == "same") { //if there is a piece on the square that isn't the color of the piece
                        console.log("occupier color", occupier['color'], "my color", PcColor)
                        retobj['captures'].push(square);
                        j=gridwidth+1 // break
                    } else {
                        break
                    }
                }
            }
        }
    }
    if (PcCapType == 'different') { //same capture handling is inside the leaper and slider handling, but different handling will be here
        for (let i=0;i<gridwidth;i++) {
            for (let j=0;j<PcLogic['special']['capture-vectors'];j++) {
            CapList.push(PcLogic['special']['capture-vectors'][i].map(n => flippedcoefficient*n))
            }
        }
         for (let i=0;i<CapList;i++) {
            let square = [sx + Caplist[i][0], sy + CapList[i][1]]
            if (findPc(square[0], square[1])) {
                retobj['captures'].push(square)
            }
         }
    }
    console.log(PcCapType)
    return retobj //return x and y coords of every allowed square
}
function areafind (cols, rows) { //returns list of the pieces within the list of rows and columns and returns false if there are none in the area. input goes as follows: areafind ([col1, col2, col...],[row1, row2, row...]);
    let retlis = []
    for (let i=0;i<cols.length;i++) {
        for (let j=0;j<rows.length;j++) {
            let temppc = findPc(rows[i],cols[j])
            if (temppc) {retlis.push(temppc)}
        }
    }
    if (retlis.length > 0) {return retlis} else {return false}
}
function globalLogicChecker (grid) {
    GlobLogic["Turn"] = GlobLogic["Teams"][(GlobLogic["Teams"].findIndex(GlobLogic["Turn"]) + 1)%(GlobLogic["Teams"].length)]
    // castle checker
    if (findPc(3, 7).isUnmoved) { //if white king is unmoved
        if (findPc(7, 7).isUnmoved) { // if right hand white rook is unmoved
            if (!areafind([4, 5, 6], [7])) {
                GlobLogic["castle-r-w"] = true
            }
        }
        if (findPc(0, 0).isUnmoved) {
            if (!areafind([1, 2], [7])) {
                GlobLogic["castle-l-w"] = true
            }
        }
    } else if (findPc(3, 0).isUnmoved) { //if white king is unmoved
        if (findPc(7, 0).isUnmoved) { // if right hand white rook is unmoved
            if (!areafind([4, 5, 6], [0])) {
                GlobLogic["castle-r-b"] = true
            }
        }
        if (findPc(0, 0).isUnmoved) {
            if (!areafind([1, 2], [0])) {
                GlobLogic["castle-l-b"] = true
            }
        }
    }
    // check checker (maybe put this and the check mate checker in another function that gets called every time a move is attempted, or call this function that much)
    // check mate checker
    // 
}
function drawhighlight(x, y, ctx, type, radius) {
    const highlightcolor = "rgb(0 0 0 / 25%)"
    if (type == 'move') {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = highlightcolor
        ctx.fill();
        //ctx.strokeStyle = highlightcolor;
        //ctx.stroke();
        //console.log('drew highlight')
    }
    if (type == 'capture') {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = highlightcolor;
        ctx.lineWidth = 30;
        ctx.stroke();
        //console.log('drew highlight')
    }
}
function highlightsquares(grid, elementid, moves, captures) {
    var c = document.getElementById(elementid);
    var ctx = c.getContext("2d");
    var dwidth = c.width; var dheight = c.height; //Screen width and height
    var tilewidth = dwidth / grid.length; var tileheight = dheight / grid[0].length; // Tile height and width
    
    for (let i=0;i<moves.length;i++) {
        let square = [moves[i][0], moves[i][1]]; var circlex = (square[0]+0.5)*tilewidth; var circley = (square[1]+0.5)*tileheight; 
        drawhighlight(circlex, circley, ctx, 'move', tilewidth/2)
    }
    for (let i=0;i<captures.length;i++) {
        let square = [captures[i][0], captures[i][1]]; var circlex = (square[0]+0.5)*tilewidth; var circley = (square[1]+0.5)*tileheight; 
        drawhighlight(circlex, circley, ctx, 'capture', tilewidth/2)
    }
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
        let tempsprite = new Sprite(tilewidth, tileheight, PcsList[i].x * tilewidth, PcsList[i].y * tileheight, `${PcsList[i].type}_${PcsList[i].color}`, ctx)
        tempsprite.draw()
        } else {
            let tempsprite = new Sprite(tilewidth, tileheight, mouseX - tilewidth/2, mouseY -tileheight/2, `${PcsList[i].type}_${PcsList[i].color}`, ctx)
            tempsprite.draw()
        }
    }
}
let highlightedSquares = {captures: [], moves: []}
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
    let allowedSquares = GetAllowedSquares(draggingIdx, GRIDWIDTH, GRIDHEIGHT);
      console.log(GetAllowedSquares(draggingIdx, GRIDWIDTH, GRIDHEIGHT))
      highlightedSquares.moves = allowedSquares.moves || []
      highlightedSquares.captures = allowedSquares.captures || []
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
async function init () {
    try {
        PcsList = await readformation('starting_formation');
        GlobLogic = await readlogic('global');
        for (let i=0;i<GlobLogic.Pcs.length;i++) {
            let PcLogic = await readlogic(GlobLogic.Pcs[i])
            PcsLogic[`${GlobLogic.Pcs[i]}`] = PcLogic
        }
    } catch (e) {
        console.error(e)
    }
}
init ()
//readformation('starting_formation')
//  .then(data => PcsList = data)
//  .catch(err => console.error(err));
let maingrid = createGrid(GRIDHEIGHT,GRIDWIDTH)
console.log(maingrid)
console.log(PcsLogic)
//addPc("K", "Black", 2, 4)
setupInput("maincanvas", maingrid)
function drawAll() {
    renderGrid(maingrid, "maincanvas")
    renderPcs(maingrid, "maincanvas")
    highlightsquares(maingrid, "maincanvas", highlightedSquares.moves, highlightedSquares.captures);
    requestAnimationFrame(drawAll)
}
console.log("GlobLogic: ", GlobLogic)
console.log("PcsLogic: ", PcsLogic)
drawAll()