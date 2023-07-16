
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

interface FallingState {
  isFalling(): boolean;
  moveHorizontal(dx: number): void;
}

class Falling implements FallingState {
  isFalling(): boolean { return true; }
  moveHorizontal(dx: number): void {
  }
}

class Resting implements FallingState {
  isFalling(): boolean { return false; }
  moveHorizontal(dx: number): void {
    if (map[playery][playerx + dx + dx].isAir()
      && !map[playery + 1][playerx + dx].isAir()) {
      map[playery][playerx + dx + dx] = map[playery][playerx + dx];
      moveToTile(playerx + dx, playery);
    }
  }
}


class FallStrategy {
  constructor(private falling: FallingState) {
    this.falling = falling;
  }
  update(tile: Tile, x: number, y: number) {
    this.falling = (map[y + 1][x].isAir()) ? new Falling() : new Resting();
    this.drop(tile, x, y);

  }
  private drop(tile: Tile, x: number, y: number) {
    if (this.falling.isFalling()) {
      map[y + 1][x] = tile;
      map[y][x] = new AirTile();
    }
  }

  getFalling(): FallingState { return this.falling; }
}

interface Tile {
  colorGet(): string;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  isAir(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  moveHorizontal(dx: number): void;
  moveVertical(dy: number): void;
  update(x: number, y: number): void;
}

class AirTile implements Tile {
  colorGet(): string { return ""; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) { }
  isAir(): boolean { return true; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) {
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
    moveToTile(playerx, playery + dy);
  }
  update(x: number, y: number) { }
}

class FluxTile implements Tile {
  colorGet(): string { return "#ccffcc"; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.colorGet();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) {
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
    moveToTile(playerx, playery + dy);
  }
  update(x: number, y: number) { }
}

class UnbreakableTile implements Tile {
  colorGet(): string { return "#999999"; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.colorGet();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number): void { }
  update(x: number, y: number) { }
}

class PlayerTile implements Tile {
  colorGet(): string { return ""; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) { }
  isAir(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number): void { }
  update(x: number, y: number) { }
}

class StoneTile implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  colorGet(): string { return "#0000cc"; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.colorGet();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) {
    this.fallStrategy.getFalling().moveHorizontal(dx);
  }
  moveVertical(dy: number): void { }
  update(x: number, y: number) {
    this.fallStrategy.update(this, x, y);
  }
}

class BoxTile implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  colorGet(): string { return "#8b4513"; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.colorGet();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) {
    this.fallStrategy.getFalling().moveHorizontal(dx);
  }
  moveVertical(dy: number): void { }
  update(x: number, y: number) {
    this.fallStrategy.update(this, x, y);
  }
}

class KeyConfiguration {
  constructor(
    private color: string,
    private removeStrategy: RemoveStrategy,
    // private lockIndex: number,
  ) { }
  getColor() { return this.color; }
  getRemoveStrategy() { return this.removeStrategy; }
  // getLockIndex() { return this.lockIndex; }
}

class Key implements Tile {
  constructor(
    private keyConfiguration: KeyConfiguration,
  ) { }

  colorGet(): string { return this.keyConfiguration.getColor(); }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.colorGet();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) {
    remove(this.keyConfiguration.getRemoveStrategy());
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
    remove(this.keyConfiguration.getRemoveStrategy());
    moveToTile(playerx, playery + dy);
  }
  update(x: number, y: number) { }
}

class LockTile implements Tile {
  constructor(
    private lockIdx: number,
    private keyConfiguration: KeyConfiguration,
  ) { }
  colorGet(): string { return this.keyConfiguration.getColor(); }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.colorGet();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isLock1(): boolean { return this.lockIdx === 1; }
  isLock2(): boolean { return this.lockIdx === 2; }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number): void { }
  update(x: number, y: number) { }
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
  [2, 3, 0, 1, 10, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 11, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

let map: Tile[][];

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
    case RawTile.STONE: return new StoneTile(new Resting());
    case RawTile.FALLING_STONE: return new StoneTile(new Falling());
    case RawTile.BOX: return new BoxTile(new Resting());
    case RawTile.FALLING_BOX: return new BoxTile(new Falling());
    case RawTile.KEY1: return new Key(new KeyConfiguration("#ffcc00", new RemoveLock1()));
    case RawTile.LOCK1: return new LockTile(1, new KeyConfiguration("#ffcc00", new RemoveLock1()));
    case RawTile.KEY2: return new Key(new KeyConfiguration("#00ccff", new RemoveLock2()));
    case RawTile.LOCK2: return new LockTile(2, new KeyConfiguration("#00ccff", new RemoveLock2()));
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

interface RemoveStrategy {
  check(tile: Tile): boolean;
}

class RemoveLock1 implements RemoveStrategy {
  check(tile: Tile) {
    return tile.isLock1();
  }
}

class RemoveLock2 implements RemoveStrategy {
  check(tile: Tile) {
    return tile.isLock2();
  }
}

function remove(shouldRemove: RemoveStrategy) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (shouldRemove.check(map[y][x])) {
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
  map[y][x].update(x, y);
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