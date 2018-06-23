// Enemies our player must avoid
let Enemy = function() {
  this.x;
  this.y;
  this.sprite;
  this.goingRight;
  // I wanted bugs to be unpredictable so I radomized their speed.
  this.setSpeed = function () {
    return Math.floor(Math.random() * 5) + 1;
  };

  this.speedFactor = this.setSpeed();
  this.reposition = function () {
    this.y = ((Math.floor(Math.random() * 3) + 1) * 100) - 60;
    if(this.goingRight) {
      this.sprite = 'images/enemy-bug-right.png';
      this.x = 0;
    }
    else {
      this.x = 450;
      this.sprite = 'images/enemy-bug-left.png';
    }
  };
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if (this.goingRight) {
    if (this.x >= 400) {
      this.goingRight = this.setDirection();
      this.speedFactor = this.setSpeed();
      this.reposition();
    }
    this.x = (this.x + this.speedFactor + (50 * dt));
  }
  else {
    if (this.x <= 0) {
      this.goingRight = this.setDirection();
      this.speedFactor = this.setSpeed();
      this.reposition();
    }
    this.x = (this.x - this.speedFactor - (50 * dt));
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
let Player = function() {
  this.x;
  this.y;
  this.sprite;
  this.lives = 4;
};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.update = function (dt) {
  this.x = this.x;
  this.y = this.y;
};

Player.prototype.handleInput = function (input) {
  switch (input) {
    case 'up':
    this.y = this.y - 80;
    break;
    case 'down':
    this.y = this.y + 80;
    if(this.y >= 400) {
      this.y = this.y - 80;
    }
    break;
    case 'left':
    this.x = this.x - 100;
    if(this.x <= -50) {
      this.x = this.x + 100;
    }
    break;
    case 'right':
    this.x = this.x + 100;
    if (this.x >= 450) {
      this.x = this.x - 100;
    }
    break;
  }
  // This condition checks if the player has reached the water.
  if(player.y <= 0) {
    score = score + 500;
    document.querySelector('#score').innerHTML = `${score}`;
    checkPlayerWin();
    player.x = 200;
    player.y = 375;
  }
};

let Level = function () {
}

Level.prototype.makeEnemy = function () {
  return this.makeEnemy();
};

Level.prototype.makePlayer = function () {
  return this.makePlayer();
};

// Since I'm making multiple levels, I want the behaviors of my Enemies and
// Player to be different for each level.
function LevelOne() {
  Level.call(this);
  function LevelOneEnemy() {
    Enemy.call(this);
    // Bugs go in oppossing directions to increase dificulty.
    this.setDirection = function () {
      const direction = Math.floor((Math.random() * 2) + 1);
      if (direction === 1) {
        return true;
      }
      else {
        return false;
      }
    };
    this.goingRight = this.setDirection();
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    if (this.goingRight) {
      // The image/sprite for our enemies, this uses
      // a helper we've provided to easily load images
      this.sprite = 'images/enemy-bug-right.png';
      this.x = 0;
    }
    else {
      this.sprite = 'images/enemy-bug-left.png';
      this.x = 400;
    }
    // This random y value should be within the three street tiles.
    this.y = ((Math.floor(Math.random() * 3) + 1) * 50);
  }

  LevelOneEnemy.prototype = Enemy;

  function LevelOnePlayer() {
    Player.call(this);
    this.x = 200;
    this.y = 375;
    this.sprite = 'images/char-boy.png';
  }

  LevelOnePlayer.prototype = Player;

  this.makeEnemy = function () {
    return new LevelOneEnemy;
  }
  this.makePlayer = function () {
    return new LevelOnePlayer;
  }



  // All levels should have an enemies property.
  let bug1 = this.makeEnemy();
  let bug2 = this.makeEnemy();
  let bug3 = this.makeEnemy();
  let bug4 = this.makeEnemy();
  let bug5 = this.makeEnemy();
  let bug6 = this.makeEnemy();
  this.enemies = [bug1, bug2, bug3, bug4, bug5, bug6];
  this.player = this.makePlayer();
}

LevelOne.prototype = Level;

function checkCollisions() {
  allEnemies.forEach(function(enemy){
    // These variables should make this easier to read but basically if a bug
    // comes within a 100 x 50 (x, y) area of the player, the player is reset.
    const closeOnX = (enemy.x >= (player.x - 50) && enemy.x <= (player.x + 50));
    const closeOnY = (enemy.y >= (player.y - 25) && enemy.y <= (player.y + 25));
    if((closeOnX) && (closeOnY)) {
      player.lives = player.lives - 1;
      const heartsLeft = document.querySelectorAll('.fa-heart');
      if(heartsLeft.length != 1) {
        heartsLeft[0].className = 'fa fa-heart-o';
        heartsLeft[0].classList.toggle('lostLife');
      }
      else {
        heartsLeft[0].className = 'fa fa-heart-o';
        heartsLeft[0].classList.toggle('lostLife');
        endGame();
      }
      player.x = 200;
      player.y = 375;
    }
  });
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.prototype.handleInput.call(player, allowedKeys[e.keyCode]);
});

//This is for everything that may occur after this js file.
window.addEventListener('load', function(){
  document.querySelector('#mobileSupportButtons').addEventListener('click', function(e){
    if (e.target.classList[0] === 'touchButtons') {
      let allowedButtonId = {
        arrowUpKey: 'up',
        arrowDownKey: 'down',
        arrowRightKey: 'right',
        arrowLeftKey: 'left'
      };
      e.target.classList.toggle('buttonPress');
      setTimeout(function () {
        e.target.classList.toggle('buttonPress');
        player.prototype.handleInput.call(player, allowedButtonId[e.target.id]);
      }, 50);
    }
  });
  document.querySelector('#startGameButton').addEventListener('click', function() {
    gameRunning = true;
    timerInterval = setInterval(startTimer, 10);
  });
});

//This function allows users to change their character.
function iconSelect(e) {
  const testVariable = document.querySelector('.playerSelected');
  document.querySelector('.playerSelected').classList.toggle('playerSelected');
  e.target.classList.toggle('playerSelected');
  player.sprite = e.target.src.split('game/')[1];
}

document.querySelectorAll('.player').forEach(function(icon){
    icon.addEventListener('click', iconSelect);
});

function fillZero(num) {
  //This function should
  if (num < 10) {
    num = "0" + num;
  }
  return num;
}

function startTimer() {
  if(gameRunning) {
    // This function will run in the background, constantly updating the timer.
    tens++;
    if (tens > 99) {
      seconds++;
      tens = 0;
    }
    if (seconds >= 60) {
      minutes++;
      seconds = 0;
    }
    document.querySelector('#time').innerHTML = `${fillZero(minutes)}:${fillZero(seconds)}:${fillZero(tens)}`;
  }
}

function resetTimer() {
  // resets all data related to the timer.
  clearInterval(timerInterval);
  document.querySelector('#time').innerHTML = "00:00:00";
  seconds = 0;
  tens = 0;
  minutes = 0;
}

function checkPlayerWin() {
  if (score >= 5000) {
    gameRunning = false;
    document.querySelector('#modalTriggerWin').click();
    document.querySelectorAll('.timeResult')[0].innerHTML = `${minutes} minutes, ${seconds} seconds.`;
    document.querySelectorAll('.scoreResult')[0].innerHTML = `${score}`;
    document.querySelector('.livesResult').innerHTML = `${player.lives}`;
  }
}

function endGame() {
  gameRunning = false;
  document.querySelector('#modalTriggerLose').click();
  document.querySelectorAll('.timeResult')[1].innerHTML = `${minutes} minutes, ${seconds} seconds.`;
  document.querySelectorAll('.scoreResult')[1].innerHTML = `${score}`;
}

let level_one = new LevelOne;
let allEnemies;
let player;
let seconds = 0;
let tens = 0;
let minutes = 0;
let score = 0;
let gameRunning = false;
let timerInterval;

function setLevel(allEnemies, player, level) {
  allEnemies = level.enemies;
  player = level.player;
  return [allEnemies, player];
}

let gameData = setLevel(allEnemies, player, level_one);

allEnemies = gameData[0];
player = gameData[1];
