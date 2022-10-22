const skins = document.querySelectorAll('.skin');
var skin = skins[7]; 

function main() {
document.querySelector('#starting_screen').style.display = 'none';
document.querySelector('.game_container').style.display = 'block';
const SEED = Number.parseInt(document.querySelector('.seed_input').value, 36) || Math.round(Math.random()*1000000);
var rand = mulberry32(SEED);
const c = document.querySelector('.game');
const ctx = c.getContext('2d');
var playerX = 10;
var playerY = 300;
var jumpTimer = 0;
var keys = {'ArrowUp':false, 'ArrowLeft':false, 'ArrowRight':false}

function mulberry32(seed) {
  // This is using Mulberry32, made by tommyettinger
  // https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
  var a = seed;
  var next = function(min, max) {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    var num = ((t ^ t >>> 14) >>> 0) / 4294967296;
    return Math.round(num*(max-min)+min);
  };
  return next;
}

function randint(min, max) {
  return Math.round(Math.random()*(max-min)+min);
}

function make_level_not_seed() {
  ctx.clearRect(0, 0, 500, 500);
  ctx.fillStyle = '#0a0';
  var left = 0;
  var top = 350;
  while (left < 500) {
    var width = randint(10, 50);
    var height = randint(10, 50);
    left += randint(1, 10);
    top += randint(-50, 50);
    top = Math.max(Math.min(top, 450-height), 50+height);
    ctx.fillRect(left, top, width, height);
    //ctx.strokeRect(left, top, width, height);
    left += width;
  }
}

function make_level() {
  ctx.clearRect(0, 0, 500, 500);
  ctx.fillStyle = '#0a0';
  var left = 0;
  var top = 350;
  while (left < 500) {
    var width = rand(10, 50);
    var height = rand(10, 50);
    left += rand(1, 10);
    top += rand(-50, 50);
    top = Math.max(Math.min(top, 450-height), 50+height);
    ctx.fillRect(left, top, width, height);
    //ctx.strokeRect(left, top, width, height);
    left += width;
  }
}

function keydown(e) {
  keys[e.code] = true;
}

function keyup(e) {
  keys[e.code] = false;
}

function get_colors_around() {
  var colors = {'above':false,'below':false,'toLeft':false,'toRight':false};
  for (var i = 0; i < 10; i++) {
    var color = ctx.getImageData(playerX+i, playerY-1, 1, 1).data;
    if (color[0] == 0 && color[1] == 170 && color[2] == 0) {
      colors['above'] = true;
    }
  }
  for (var i = 0; i < 10; i++) {
    var color = ctx.getImageData(playerX+i, playerY+10, 1, 1).data;
    if (color[0] == 0 && color[1] == 170 && color[2] == 0) {
      colors['below'] = true;
    }
  }
  for (var i = 0; i < 10; i++) {
    var color = ctx.getImageData(playerX-1, playerY+i, 1, 1).data;
    if (color[0] == 0 && color[1] == 170 && color[2] == 0) {
      colors['toLeft'] = true;
    }
  }
  for (var i = 0; i < 10; i++) {
    var color = ctx.getImageData(playerX+10, playerY+i, 1, 1).data;
    if (color[0] == 0 && color[1] == 170 && color[2] == 0) {
      colors['toRight'] = true;
    }
  }
  return colors;
}
  
var clearLevel = true;
function loop() {
  //var colorsBelow = ctx.getImageData(playerX, playerY+10, 10, 1).data;
  //var colorsAbove = ctx.getImageData(playerX, playerY-1, 10, 1).data;
  //var colorsToLeft = ctx.getImageData(playerX-1, playerY, 1, 10).data;
  //var colorsToRight = ctx.getImageData(playerX+10, playerY, 1, 10).data;
  //console.log(`${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]}`);
  var colors = get_colors_around();
  if (colors['below']) {jumpTimer = 0;}
  if (keys['ArrowUp']) {jumpTimer += 1;}
  if (jumpTimer > 50) {/*jumpTimer = 0;*/ keys['ArrowUp'] = false;}
  ctx.clearRect(playerX, playerY, 10, 10);
  if (!colors['toRight'] /*!(colorsToRight[0] == 0 && colorsToRight[1] == 170 && colorsToRight[2] == 0)*/) {playerX += keys['ArrowRight'] * 1;}
  if (playerX - keys['ArrowLeft'] * 1 > -1 && !colors['toLeft'] /*!(colorsToLeft[0] == 0 && colorsToLeft[1] == 170 && colorsToLeft[2] == 0)*/) {playerX -= keys['ArrowLeft'] * 1;}
  if ((colors['below'] || jumpTimer > 0) && playerY - keys['ArrowUp'] * 1 > -1 && !colors['above'] /*!(colorsAbove[0] == 0 && colorsAbove[1] == 170 && colorsAbove[2] == 0)*/) {playerY -= keys['ArrowUp'] * 1;}
  if (!keys['ArrowUp'] && !colors['below'] /*!(colorsBelow[0] == 0 && colorsBelow[1] == 170 && colorsBelow[2] == 0)*/) {playerY += 1;}
  // ERROR: Jumping up and down causes sinking into platform 
  if (playerY > 500) {
    playerX = 10;
    playerY = 300;
  }
  //ctx.clearRect(0, 0, 500, 500);
  ctx.drawImage(skin, playerX, playerY);
  if (playerX > 500) {
    playerX = 10;
    playerY = 300;
    make_level();
  }
}

make_level();

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);

document.querySelector('#seed_txt').innerHTML = 'Seed: '+SEED.toString(36);
// ERROR: Numbers inputed can sometimes translate wrong
game = setInterval(loop, 10);
function stop_game() {clearInterval(game);ctx.clearRect(0,0,500,500);}
}

window.addEventListener('load', function() {
  const button = document.querySelector('button.start');
  button.addEventListener('click', main);
});
