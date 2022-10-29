const skins = document.querySelectorAll('.skin');
var skin = skins[0]; 

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
var level = 1;
var speed = 1;
var jump_speed = 1;
var gravity = 1;
var jump_height = 50;

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
  var colors = get_colors_around();
  if ((!colors['below'] && jumpTimer == 0) || colors['above']) {jumpTimer = jump_height;}
  if (colors['below']) {jumpTimer = 0;}
  if (keys['ArrowUp']) {jumpTimer += 1;}
  if (jumpTimer > jump_height) {keys['ArrowUp'] = false;}
  ctx.clearRect(playerX, playerY, 10, 10);
  if (!colors['toRight']) {playerX += keys['ArrowRight'] * speed;}
  if (playerX - keys['ArrowLeft'] * 1 > -1 && !colors['toLeft']) {playerX -= keys['ArrowLeft'] * speed;}
  if ((colors['below'] || jumpTimer > 0) && playerY - keys['ArrowUp'] * 1 > -1 && !colors['above']) {playerY -= keys['ArrowUp'] * jump_speed;}
  if (!keys['ArrowUp'] && !colors['below']) {playerY += gravity;}
  if (playerY > 500) {
    playerX = 10;
    playerY = 300;
  }
  ctx.drawImage(skin, playerX, playerY);
  if (playerX > 500) {
    playerX = 10;
    playerY = 300;
    level += 1
    if (level == 5) {document.querySelectorAll('.skin_div')[1].dataset.locked = 0; document.querySelectorAll('.skin_div')[1].classList.remove('locked');}
    if (level == 10) {document.querySelectorAll('.skin_div')[2].dataset.locked = 0; document.querySelectorAll('.skin_div')[2].classList.remove('locked');}
    if (level == 15) {document.querySelectorAll('.skin_div')[3].dataset.locked = 0; document.querySelectorAll('.skin_div')[3].classList.remove('locked');}
    if (level == 25) {document.querySelectorAll('.skin_div')[4].dataset.locked = 0; document.querySelectorAll('.skin_div')[4].classList.remove('locked');}
    if (level == 50) {document.querySelectorAll('.skin_div')[5].dataset.locked = 0; document.querySelectorAll('.skin_div')[5].classList.remove('locked');}
    if (level == 100) {document.querySelectorAll('.skin_div')[6].dataset.locked = 0; document.querySelectorAll('.skin_div')[6].classList.remove('locked');}
    document.querySelector('#level_txt').innerHTML = "Level: "+String(level)
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

document.addEventListener('click', e => {
  if (e.target.matches('.skin_div') && e.target.dataset.locked == 0) {
    document.querySelectorAll('.skin_div').forEach(s => {s.classList.remove('current_skin');});
    e.target.classList.add('current_skin');
    skin = skins[e.target.dataset.skin];
  }
})

const cheat_code = 'I AM A DEV 1 1 2 3 5 8 13 21';
const cheat_code1 = 'BREAK DA LOCKS';
const cheat_code2 = 'SKIPPY';
const cheat_code3 = "&&((%'%'BA ";
var code = '';
//console.log(String.fromCharCode(13))
window.addEventListener('keydown',function(e) {
  //console.log(e.keyCode)
  code = (code+String.fromCharCode(e.keyCode || e.which));
  if( code.substr(-1*cheat_code.length) == cheat_code) {
    //window.removeEventListener('keydown',arguments.callee);
    document.querySelectorAll('.skin_div')[7].dataset.locked = 0;
    document.querySelectorAll('.skin_div')[7].classList.remove('locked');
    document.querySelectorAll('.skin_div').forEach(s => {s.classList.remove('current_skin');});
    document.querySelectorAll('.skin_div')[7].classList.add('current_skin');
    skin = skins[7];
  }
  else if (code.substr(-1*cheat_code1.length) == cheat_code1) {
    //window.removeEventListener('keydown',arguments.callee);
    document.querySelectorAll('.skin_div')[1].dataset.locked = 0; document.querySelectorAll('.skin_div')[1].classList.remove('locked');
    document.querySelectorAll('.skin_div')[2].dataset.locked = 0; document.querySelectorAll('.skin_div')[2].classList.remove('locked');
    document.querySelectorAll('.skin_div')[3].dataset.locked = 0; document.querySelectorAll('.skin_div')[3].classList.remove('locked');
    document.querySelectorAll('.skin_div')[4].dataset.locked = 0; document.querySelectorAll('.skin_div')[4].classList.remove('locked');
    document.querySelectorAll('.skin_div')[5].dataset.locked = 0; document.querySelectorAll('.skin_div')[5].classList.remove('locked');
    document.querySelectorAll('.skin_div')[6].dataset.locked = 0; document.querySelectorAll('.skin_div')[6].classList.remove('locked');
  }
  else if (code.substr(-1*cheat_code2.length) == cheat_code2) {
    playerX = 10;
    playerY = 300;
    level += 1
    if (level == 5) {document.querySelectorAll('.skin_div')[1].dataset.locked = 0; document.querySelectorAll('.skin_div')[1].classList.remove('locked');}
    if (level == 10) {document.querySelectorAll('.skin_div')[2].dataset.locked = 0; document.querySelectorAll('.skin_div')[2].classList.remove('locked');}
    if (level == 15) {document.querySelectorAll('.skin_div')[3].dataset.locked = 0; document.querySelectorAll('.skin_div')[3].classList.remove('locked');}
    if (level == 25) {document.querySelectorAll('.skin_div')[4].dataset.locked = 0; document.querySelectorAll('.skin_div')[4].classList.remove('locked');}
    if (level == 50) {document.querySelectorAll('.skin_div')[5].dataset.locked = 0; document.querySelectorAll('.skin_div')[5].classList.remove('locked');}
    if (level == 100) {document.querySelectorAll('.skin_div')[6].dataset.locked = 0; document.querySelectorAll('.skin_div')[6].classList.remove('locked');}
    document.querySelector('#level_txt').innerHTML = "Level: "+String(level)
    make_level();
  }
  else if (code.substr(-1*cheat_code3.length) == cheat_code3) {
    jump_height = 100;
    jump_speed = 2;
  }
},false);
}

window.addEventListener('load', function() {
  const button = document.querySelector('button.start');
  button.addEventListener('click', main);
});
