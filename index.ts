
const TILE_SIZE = 40;
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
  drop(tile: Tile, x: number, y: number): void;
}

class Falling implements FallingState {
  isFalling(): boolean { return true; }
  moveHorizontal(dx: number): void {
  }
  drop(tile: Tile, x: number, y: number) {
    map[y + 1][x] = tile;
    map[y][x] = new AirTile();
  }
}

class Resting implements FallingState {
  isFalling(): boolean { return false; }
  moveHorizontal(dx: number): void {
    if (map[player.getY()][player.getX() + dx + dx].isAir()
      && !map[player.getY() + 1][player.getX() + dx].isAir()) {
      map[player.getY()][player.getX() + dx + dx] = map[player.getY()][player.getX() + dx];
      moveToTile(player.getX() + dx, player.getY());
    }
  }
  drop(tile: Tile, x: number, y: number) { }
}


class FallStrategy {
  constructor(private falling: FallingState) {
    this.falling = falling;
  }
  update(tile: Tile, x: number, y: number) {
    this.falling = map[y + 1][x].getBlockOnTopState();
    this.drop(tile, x, y);

  }
  private drop(tile: Tile, x: number, y: number) {
    this.falling.drop(tile, x, y);
  }
  moveHorizontal(dx: number): void { this.falling.moveHorizontal(dx); }
}

interface Tile {
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  isAir(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  moveHorizontal(dx: number): void;
  moveVertical(dy: number): void;
  update(x: number, y: number): void;
  getBlockOnTopState(): FallingState;
}

class AirTile implements Tile {
  draw(g: CanvasRenderingContext2D, x: number, y: number) { }
  isAir(): boolean { return true; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) {
    moveToTile(player.getX() + dx, player.getY());
  }
  moveVertical(dy: number): void {
    moveToTile(player.getX(), player.getY() + dy);
  }
  update(x: number, y: number) { }
  getBlockOnTopState(): FallingState { return new Falling(); }
}

class FluxTile implements Tile {
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ccffcc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) {
    moveToTile(player.getX() + dx, player.getY());
  }
  moveVertical(dy: number): void {
    moveToTile(player.getX(), player.getY() + dy);
  }
  update(x: number, y: number) { }
  getBlockOnTopState(): FallingState { return new Resting(); }
}

class UnbreakableTile implements Tile {
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number): void { }
  update(x: number, y: number) { }
  getBlockOnTopState(): FallingState { return new Resting(); }
}

class PlayerTile implements Tile {
  draw(g: CanvasRenderingContext2D, x: number, y: number) { }
  isAir(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number): void { }
  update(x: number, y: number) { }
  getBlockOnTopState(): FallingState { return new Resting(); }
}

class StoneTile implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) {
    this.fallStrategy.moveHorizontal(dx);
  }
  moveVertical(dy: number): void { }
  update(x: number, y: number) {
    this.fallStrategy.update(this, x, y);
  }
  getBlockOnTopState(): FallingState { return new Resting(); }
}

class BoxTile implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) {
    this.fallStrategy.moveHorizontal(dx);
  }
  moveVertical(dy: number): void { }
  update(x: number, y: number) {
    this.fallStrategy.update(this, x, y);
  }
  getBlockOnTopState(): FallingState { return new Resting(); }
}

class CellRenderingContext {
  constructor(
    private g: CanvasRenderingContext2D,
    private posX: number,
    private posY: number,
  ) { }
  draw(color: string) {
    this.g.fillStyle = color;
    this.g.fillRect(this.posX * TILE_SIZE, this.posY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}

class KeyConfiguration {
  constructor(
    private color: string,
    private removeStrategy: RemoveStrategy,
    private lockIndex: number,
  ) { }
  getLockIndex() { return this.lockIndex; }
  removeLock() { remove(this.removeStrategy); }
  fillRect(cellRdrCtx: CellRenderingContext) {
    cellRdrCtx.draw(this.color);
  }
}

class Key implements Tile {
  constructor(
    private keyConfiguration: KeyConfiguration,
  ) { }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    let cellRenderingCtx = new CellRenderingContext(g, x, y);
    this.keyConfiguration.fillRect(cellRenderingCtx);
  }
  isAir(): boolean { return false; }
  isLock1(): boolean { return false; }
  isLock2(): boolean { return false; }
  moveHorizontal(dx: number) {
    this.keyConfiguration.removeLock();
    moveToTile(player.getX() + dx, player.getY());
  }
  moveVertical(dy: number): void {
    this.keyConfiguration.removeLock();
    moveToTile(player.getX(), player.getY() + dy);
  }
  update(x: number, y: number) { }
  getBlockOnTopState(): FallingState { return new Resting(); }
}

class LockTile implements Tile {
  constructor(
    private keyConfiguration: KeyConfiguration,
  ) { }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    let cellRenderingCtx = new CellRenderingContext(g, x, y);
    this.keyConfiguration.fillRect(cellRenderingCtx);
  }
  isAir(): boolean { return false; }
  isLock1(): boolean { return this.keyConfiguration.getLockIndex() === 1; }
  isLock2(): boolean { return this.keyConfiguration.getLockIndex() === 2; }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number): void { }
  update(x: number, y: number) { }
  getBlockOnTopState(): FallingState { return new Resting(); }
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

class Player {
  private x = 1;
  private y = 1;

  getX() { return this.x; }
  getY() { return this.y; }
  setX(x: number) { this.x = x; }
  setY(y: number) { this.y = y; }
}
let player: Player = new Player();

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

function assertExhausted(x: never): never {
  throw new Error("Unexpected object: " + x);
}

const YELLOW_KEY = new KeyConfiguration("#ffcc00", new RemoveLock1(), 1);
const BLUE_KEY = new KeyConfiguration("#00ccff", new RemoveLock2(), 2);

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
    case RawTile.KEY1: return new Key(YELLOW_KEY);
    case RawTile.LOCK1: return new LockTile(YELLOW_KEY);
    case RawTile.KEY2: return new Key(BLUE_KEY);
    case RawTile.LOCK2: return new LockTile(BLUE_KEY);
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

function moveToTile(newx: number, newy: number) {
  map[player.getY()][player.getX()] = new AirTile();
  map[newy][newx] = new PlayerTile();
  player.setX(newx);
  player.setY(newy);
}

function moveHorizontal(dx: number) {
  map[player.getY()][player.getX() + dx].moveHorizontal(dx);
}

function moveVertical(dy: number) {
  map[player.getY() + dy][player.getX()].moveVertical(dy);
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
  g.fillRect(player.getX() * TILE_SIZE, player.getY() * TILE_SIZE, TILE_SIZE, TILE_SIZE);
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