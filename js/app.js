let allEnemies;
let allGems;
let player;
// The three variables above must be set for engine.js to function.
let seconds = 0;
let tens = 0;
let minutes = 0;
let score = 0;
// gameRunning controls if the timer and cavans will up date in the background.
let gameRunning = false;
let timerInterval;
//Games start on an easy difficulty, so players can get used to the game.
let difficulty = 'easy';

// Enemies our player must avoid
let Enemy = function() {
  this.x;
  this.y;
  this.sprite;
  this.goingRight;
  // I wanted bugs to be unpredictable so I radomized their speed.
  this.setSpeed = function () {
    switch (difficulty) {
      case 'easy':
        return Math.floor(Math.random() * 3) + 1;
        break;
      case 'medium':
        return Math.floor(Math.random() * 5) + 1;
        break;
      case 'crazy':
        return Math.floor(Math.random() * 7) + 1;
        break;
    }
  }
  this.speedFactor = this.setSpeed();
  // This class function will reset the bug position giving an illusion of a
  // creating a new one. Works with the setSpeed function in the update prototype
  // prototype function.
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
  }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks.
// All objects in the game have an update and render prototype function.
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

// player class, sets only the lives, a level class will set the other properties.
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
  // This condition checks if the player has reached the water and will also
  // check if the player has won the game.
  if(player.y <= 0) {
    score = score + 500;
    document.querySelector('#score').innerHTML = `${score}`;
    checkPlayerWin();
    player.x = 200;
    player.y = 375;
  }
};

// The gem class, that sets the type and value of a gem.
let Gem = function() {
  function generateGemType() {
    const value = Math.floor((Math.random() * 3) + 1);
    switch (value) {
      case 1:
        return {sprite: 'images/Gem Blue.png', value: 500};
        break;
      case 2:
        return {sprite: 'images/Gem Green.png', value: 1000};
        break;
      case 3:
        return {sprite: 'images/Gem Orange.png', value: 2000};
        break;
    }
  }
  let gemAndValue = generateGemType()
  this.sprite = gemAndValue['sprite'];
  this.x;
  this.y;
  this.value = gemAndValue['value'];
};

Gem.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Gem.prototype.update = function (dt) {
  this.x = this.x;
  this.y = this.y;
};

// Since I'll make multiple levels later, I want the behaviors of my Enemies and
// Player to be different and similar in some ways for each level.
function LevelOne() {
  function LevelOneEnemy() {
    Enemy.call(this);
    // Bugs go in oppossing directions to increase difficulty.
    this.setDirection = function () {
      const direction = Math.floor((Math.random() * 2) + 1);
      if (direction === 1) {
        return true;
      }
      else {
        return false;
      }
    }
    this.goingRight = this.setDirection();
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
  };

  LevelOneEnemy.prototype = Enemy;

  function LevelOnePlayer() {
    Player.call(this);
    // (x,y) bottom row, center.
    this.x = 200;
    this.y = 375;
    this.sprite = 'images/char-boy.png';
  }

  LevelOnePlayer.prototype = Player;

  // Level one Gem locations are randomized and only appear on the stone tiles.
  function LevelOneGem() {
    Gem.call(this);
    this.x = ((Math.floor(Math.random() * 5) + 1) * 100);
    this.y = ((Math.floor(Math.random() * 3) + 1) * 75);
  }

  LevelOneGem.prototype = Gem;

  function generateGemArray(difficulty) {
    // This will generate the amount of gems made avalible to the player.
    let generateNum;
    switch (difficulty) {
      case 'easy':
        generateNum = 1;
        break;
      case 'medium':
        generateNum = Math.floor((Math.random() * 3) + 1);
        break;
      case 'crazy':
        generateNum = Math.floor((Math.random() * 5) + 1);
        break;
    }
    let gemArray = [];
    for (let i = 0; i < generateNum; i++){
      const gem = new LevelOneGem;
      gemArray.push(gem);
    }
    return gemArray;
  }

  function generateEnemyArray(difficulty) {
    // Will create enemies depending on difficulty.
    let generateNum;
    switch (difficulty) {
      case 'easy':
        generateNum = 4;
        break;
      case 'medium':
        generateNum = 5;
        break;
      case 'crazy':
        generateNum = 6;
        break;
    }
    let enemyArray = [];
    for (let i = 0; i < generateNum; i++){
      const enemy = new LevelOneEnemy;
      enemyArray.push(enemy);
    }
    return enemyArray;
  }
  // All levels should have a player, enemy/gem array as properties in order for
  // the setlevel function to work properly.
  this.enemies = generateEnemyArray(difficulty);
  this.player = new LevelOnePlayer;
  this.gems = generateGemArray(difficulty);
}

// Both checkcollisions and checkNearbyGems are used to find out if the player
// has reached them.

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
      }
      player.x = 200;
      player.y = 375;
    }
  });
}

//Once a player has reached a gem they must be removed from the global gem Array.
function checkNearbyGems() {
  allGems.forEach(function(gem, index, array){
    // These variables should make this easier to read but basically if a bug
    // comes within a 100 x 50 (x, y) area of the player, the player is reset.
    const closeOnX = (gem.x >= (player.x - 50) && gem.x <= (player.x + 50));
    const closeOnY = (gem.y >= (player.y - 25) && gem.y <= (player.y + 25));
    if((closeOnX) && (closeOnY)) {
      score = score + gem.value;
      document.querySelector('#score').innerHTML = `${score}`;
      array.splice(index, 1);
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


//This function allows users to change their character.
function iconSelect(e) {
  const testVariable = document.querySelector('.playerSelected');
  document.querySelector('.playerSelected').classList.toggle('playerSelected');
  e.target.classList.toggle('playerSelected');
  player.sprite = e.target.src.split('game/')[1];
}
// This sets all icons to triger the above function.
document.querySelectorAll('.player').forEach(function(icon){
    icon.addEventListener('click', iconSelect);
});

// Small helper function that helps with displaying the time.
function fillZero(num) {
  //This function should
  if (num < 10) {
    num = "0" + num;
  }
  return num;
}

// This function will run in the background, constantly updating the timer.
function startTimer() {
  if(gameRunning) {
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

// this function is only called in the handleInput player prototype function.
// It will triger the end of the game.
function checkPlayerWin() {
  if (score >= 5000) {
    gameRunning = false;
    document.querySelector('#modalTriggerWin').click();
    document.querySelectorAll('.timeResult')[0].innerHTML = `${fillZero(minutes)}:${fillZero(seconds)}:${fillZero(tens)}`;
    document.querySelectorAll('.scoreResult')[0].innerHTML = `${score} Points`;
    document.querySelector('.livesResult').innerHTML = `${player.lives}`;
    document.querySelectorAll('.difficulty')[0].innerHTML = `${difficulty.toUpperCase()}`;

  }
}

// This function is called in the checkCollisions function when the player has
// lost all their lives.
function endGame() {
  gameRunning = false;
  document.querySelector('#modalTriggerLose').click();
  document.querySelectorAll('.difficulty')[1].innerHTML = `${difficulty.toUpperCase()}`;
  document.querySelectorAll('.timeResult')[1].innerHTML = `${fillZero(minutes)}:${fillZero(seconds)}:${fillZero(tens)}`;
  document.querySelectorAll('.scoreResult')[1].innerHTML = `${score} Points`;

}

// The next functions restrict the difficulty options for users if it is their
// first time playing.
function firstGameSet() {
  document.querySelector('#medium').disabled = true;
  document.querySelector('#crazy').disabled = true;
}

function unlockDifficulty() {
  document.querySelector('#medium').disabled = false;
  document.querySelector('#crazy').disabled = false;
}

let level = new LevelOne;

// This function is called in the engine.js file, and is used to set global variables
// in the event of a level change.
function setLevel(allEnemies, player, anyGems, level) {
  allEnemies = level.enemies;
  player = level.player;
  anyGems = level.gems;
  return [allEnemies, player, anyGems];
}

//This is for everything that may occur after this js file.
window.addEventListener('load', function() {
  // This will map the mobile buttons to player handleInput prototype function.
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
      });
    }
  });
  // When a player clicks on play button, global variables are initialized,
  // the timer starts, and the canvas begins updating.
  document.querySelectorAll('.startButton').forEach(function(button) {
    button.addEventListener('click', function(e) {
      difficulty = e.target.id;
      level = new LevelOne;
      gameData = setLevel(allEnemies, player, allGems, level);
      allEnemies = gameData[0];
      player = gameData[1];
      allGems = gameData[2];
      gameRunning = true;
      timerInterval = setInterval(startTimer, 10);
    });
  });
});
