
const TILE_SIZE = 30;
const FPS = 60;
const SLEEP = 1000 / FPS;

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE, FALLING_STONE,
  BOX, FALLING_BOX,
  KEY1, LOCK1,
  KEY2, LOCK2
}

interface Tile2 {
  colorGet(): string;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  isAir(): boolean;
  isStone(): boolean;
  isFallingStone(): boolean;
  isBox(): boolean;
  isFallingBox(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  moveHorizontal(dx: number): void;
  moveVertical(dy: number): void;
  isStony(): boolean;
  isBoxy(): boolean;
}

class AirTile implements Tile2 {
  colorGet(): string { return ""; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) { }
  isAir(): boolean { return true; }
  isStone(): boolean { return false; }
  isFallingStone(): boolean { return false; }
  isBox(): boolean { return false; }
  isFallingBox(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) {
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
    moveToTile(playerx, playery + dy);
  }
  isStony(): boolean { return false; }
  isBoxy(): boolean { return false; }
}

class FluxTile implements Tile2 {
  colorGet(): string { return "#ccffcc"; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.colorGet();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isStone(): boolean { return false; }
  isFallingStone(): boolean { return false; }
  isBox(): boolean { return false; }
  isFallingBox(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) {
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
    moveToTile(playerx, playery + dy);
  }
  isStony(): boolean { return false; }
  isBoxy(): boolean { return false; }
}

class UnbreakableTile implements Tile2 {
  colorGet(): string { return "#999999"; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.colorGet();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isStone(): boolean { return false; }
  isFallingStone(): boolean { return false; }
  isBox(): boolean { return false; }
  isFallingBox(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number): void { }
  isStony(): boolean { return false; }
  isBoxy(): boolean { return false; }
}

class PlayerTile implements Tile2 {
  colorGet(): string { return ""; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) { }
  isAir(): boolean { return false; }
  isStone(): boolean { return false; }
  isFallingStone(): boolean { return false; }
  isBox(): boolean { return false; }
  isFallingBox(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number): void { }
  isStony(): boolean { return false; }
  isBoxy(): boolean { return false; }
}

class StoneTile implements Tile2 {
  private falling: boolean;
  constructor(falling: boolean) {
    this.falling = falling;
  }
  colorGet(): string { return "#0000cc"; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.colorGet();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isStone(): boolean { return true; }
  isFallingStone(): boolean { return this.falling; }
  isBox(): boolean { return false; }
  isFallingBox(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) {
    if (this.isFallingStone() === false) {
      if (map[playery][playerx + dx + dx].isAir()
        && !map[playery + 1][playerx + dx].isAir()) {
        map[playery][playerx + dx + dx] = map[playery][playerx + dx];
        moveToTile(playerx + dx, playery);
      }
    }
    else if (this.isFallingStone() === true) { }
  }
  moveVertical(dy: number): void { }
  isStony(): boolean { return true; }
  isBoxy(): boolean { return false; }
}

class BoxTile implements Tile2 {
  colorGet(): string { return "#8b4513"; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.colorGet();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isStone(): boolean { return false; }
  isFallingStone(): boolean { return false; }
  isBox(): boolean { return true; }
  isFallingBox(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) {
    if (map[playery][playerx + dx + dx].isAir()
      && !map[playery + 1][playerx + dx].isAir()) {
      map[playery][playerx + dx + dx] = map[playery][playerx + dx];
      moveToTile(playerx + dx, playery);
    }
  }
  moveVertical(dy: number): void { }
  isStony(): boolean { return false; }
  isBoxy(): boolean { return true; }
}

class FallingBoxTile implements Tile2 {
  colorGet(): string { return "#8b4513"; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.colorGet();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isStone(): boolean { return false; }
  isFallingStone(): boolean { return false; }
  isBox(): boolean { return false; }
  isFallingBox(): boolean { return true; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number): void { }
  isStony(): boolean { return false; }
  isBoxy(): boolean { return true; }
}

class Key1Tile implements Tile2 {
  colorGet(): string { return "#ffcc00"; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.colorGet();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isStone(): boolean { return false; }
  isFallingStone(): boolean { return false; }
  isBox(): boolean { return false; }
  isFallingBox(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) {
    removeLock1();
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
    removeLock1();
    moveToTile(playerx, playery + dy);
  }
  isStony(): boolean { return false; }
  isBoxy(): boolean { return false; }
}

class Lock1Tile implements Tile2 {
  colorGet(): string { return "#ffcc00"; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.colorGet();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isStone(): boolean { return false; }
  isFallingStone(): boolean { return false; }
  isBox(): boolean { return false; }
  isFallingBox(): boolean { return false; }
  isLock1(): boolean { return true; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number): void { }
  isStony(): boolean { return false; }
  isBoxy(): boolean { return false; }
}

class Key2Tile implements Tile2 {
  colorGet(): string { return "#00ccff"; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.colorGet();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isStone(): boolean { return false; }
  isFallingStone(): boolean { return false; }
  isBox(): boolean { return false; }
  isFallingBox(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) {
    removeLock2();
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
    removeLock2();
    moveToTile(playerx, playery + dy);
  }
  isStony(): boolean { return false; }
  isBoxy(): boolean { return false; }
}

class Lock2Tile implements Tile2 {
  colorGet(): string { return "#00ccff"; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.colorGet();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isStone(): boolean { return false; }
  isFallingStone(): boolean { return false; }
  isBox(): boolean { return false; }
  isFallingBox(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return true; }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number): void { }
  isStony(): boolean { return false; }
  isBoxy(): boolean { return false; }
}


interface Input {
  processInput(): void;
}

class Right implements Input {
  processInput() {
    moveHorizontal(1);
  }
}

class Left implements Input {
  processInput() {
    moveHorizontal(-1);
  }
}

class Up implements Input {
  processInput() {
    moveVertical(-1);
  }
}

class Down implements Input {
  processInput() {
    moveVertical(1);
  }
}

let playerx = 1;
let playery = 1;
let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  // [2, 1, 1, 1, 1, 2, 1, 2],
  // [2, 1, 1, 1, 1, 2, 1, 2],
  // [2, 1, 1, 1, 1, 2, 1, 2],
  // [2, 1, 1, 1, 1, 2, 1, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

let map: Tile2[][];

let inputs: Input[] = [];

function assertExhausted(x: never): never {
  throw new Error("Unexpected object: " + x);
}

function createTileObject(tile: RawTile) {
  switch (tile) {
    case RawTile.AIR: return new AirTile();
    case RawTile.FLUX: return new FluxTile();
    case RawTile.UNBREAKABLE: return new UnbreakableTile();
    case RawTile.PLAYER: return new PlayerTile();
    case RawTile.STONE: return new StoneTile(false);
    case RawTile.FALLING_STONE: return new StoneTile(true);
    case RawTile.BOX: return new BoxTile();
    case RawTile.FALLING_BOX: return new FallingBoxTile();
    case RawTile.KEY1: return new Key1Tile();
    case RawTile.LOCK1: return new Lock1Tile();
    case RawTile.KEY2: return new Key2Tile();
    case RawTile.LOCK2: return new Lock2Tile();
    default: assertExhausted(tile);
  }
}

function createMapObjects(tiles: RawTile[][]) {
  map = new Array(tiles.length);
  for (let y = 0; y < tiles.length; y++) {
    map[y] = new Array(tiles[y].length);
    for (let x = 0; x < tiles[y].length; x++) {
      map[y][x] = createTileObject(tiles[y][x]);
    }
  }
}

function removeLock1() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock1()) {
        map[y][x] = new AirTile();
      }
    }
  }
}

function removeLock2() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock2()) {
        map[y][x] = new AirTile();
      }
    }
  }
}

function moveToTile(newx: number, newy: number) {
  map[playery][playerx] = new AirTile();
  map[newy][newx] = new PlayerTile();
  playerx = newx;
  playery = newy;
}

function moveHorizontal(dx: number) {
  map[playery][playerx + dx].moveHorizontal(dx);
}

function moveVertical(dy: number) {
  map[playery + dy][playerx].moveVertical(dy);
}

function update() {
  processInputs();
  updateBlocks();
}

function processInputs() {
  while (inputs.length > 0) {
    let current = inputs.pop();
    current.processInput();
  }
}


function updateBlocks() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      updateTile(x, y);
    }
  }
}

function updateTile(x: number, y: number) {
  if (map[y][x].isStony() && map[y + 1][x].isAir()) {
    map[y + 1][x] = new StoneTile(true);
    map[y][x] = new AirTile();
  } else if (map[y][x].isBoxy() && map[y + 1][x].isAir()) {
    map[y + 1][x] = new FallingBoxTile();
    map[y][x] = new AirTile();
  } else if (map[y][x].isFallingStone()) {
    map[y][x] = new StoneTile(false);
  } else if (map[y][x].isFallingBox()) {
    map[y][x] = new BoxTile();
  }
}

function draw() {
  let g = create2DCanvas();
  drawMap(g);
  drawPlayer(g);
}

function create2DCanvas() {
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  let g = canvas.getContext("2d");

  g.clearRect(0, 0, canvas.width, canvas.height);

  return g;
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(g, x, y);
    }
  }
}

function drawPlayer(g: CanvasRenderingContext2D) {
  g.fillStyle = "#ff0000";
  g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
  createMapObjects(rawMap);
  gameLoop();
}

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", e => {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});

