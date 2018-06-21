// Enemies our player must avoid
var Enemy = function() {
  // Bugs go in oppossing directions to increase dificulty.
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
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  if(this.goingRight) {
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
  this.y = ((Math.floor(Math.random() * 3) + 1) * 100) - 60;

  // I wanted bugs to be unpredictable so I radomized their speed.
  this.setSpeed = function () {
    return Math.floor(Math.random() * 5) + 1;
  }

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
  }
};

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
  this.x = 200;
  this.y = 375;
  this.sprite = 'images/char-boy.png';
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
      break;
    case 'left':
      this.x = this.x - 100;
      break;
    case 'right':
      this.x = this.x + 100;
      break;
  }
};

// Now instantiate your objects.

let bug1 = new Enemy();
let bug2 = new Enemy();
let bug3 = new Enemy();
let bug4 = new Enemy();
let bug5 = new Enemy();
let bug6 = new Enemy();



// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let allEnemies = [bug1, bug2, bug3, bug4, bug5, bug6];
let player = new Player();

function checkCollisions() {
  allEnemies.forEach(function(enemy){
    const closeOnX = (enemy.x >= (player.x - 75) && enemy.x <= (player.x + 75));
    const closeOnY = (enemy.y >= (player.y - 25) && enemy.y <= (player.y + 25));
    const onSameTile = (closeOnX) && (closeOnY);
    if(onSameTile) {
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

    player.handleInput(allowedKeys[e.keyCode]);
});
