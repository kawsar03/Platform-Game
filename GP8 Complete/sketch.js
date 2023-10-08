/*

The Game Project 7 - Bring it all together

*/

//declare variables

var game_score;
var flagpole;
var lives;
var jumpSound;
var deathSound;

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var canyons;
var collectables;
var platforms;


var themeSong = false;
var themeSound;

var finishSound;
var enemies;


// Preload Music to stop buffering

function preload()
{
    soundFormats('mp3', 'wav');
    
        
    themeSound = loadSound('assets/themesong.mp3');
    themeSound.setVolume(0.1);
    
    jumpSound = loadSound('assets/jump.mp3');
    jumpSound.setVolume(0.2);

    deathSound = loadSound('assets/death.mp3');
    deathSound.setVolume(0.1);
    
    finishSound = loadSound('assets/finish.mp3')
    finishSound.setVolume(0.1)
    


}

function setup()
{
    createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    
    lives = 4;
    startGame();
    
    platforms = [];
    
    platforms.push(createPlatform(0,floorPos_y - 100,100));
    
    platforms.push(createPlatform(500,floorPos_y - 100,100));
    
    platforms.push(createPlatform(2100,floorPos_y - 100,100));
    
    platforms.push(createPlatform(2310,floorPos_y - 150,20));
    
    

    
}

function startGame()
{
      
	
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    
    

	// Variable to control the background scrolling.
    
    scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    
    
    trees_x = [100,400,600,1100,850,1310,1330,1350,1380, 2100, 2500, 2550, 2590,3300]
    clouds = [
        
        {x_pos: 1270, y_pos: 150, speed:1.5},
        {x_pos: 700, y_pos: 140, speed:1.5},
        {x_pos: -250, y_pos: 170, speed:1.5},
        {x_pos: 2000, y_pos: 165, speed:1.5}
    ];
    
    mountains = [
        
        {x_pos: 1100, y_pos: 100},
        {x_pos: 500, y_pos: 100},
        {x_pos: -600, y_pos: 100},
        {x_pos: 1800, y_pos: 100},
        {x_pos: 2500, y_pos: 100},
        {x_pos: 3300, y_pos: 100}
    ];
    
    canyons = [
        
        {x_pos: 150, width: 100},
        {x_pos: 700, width: 100},
        {x_pos:1200, width: 100},
        {x_pos:2600, width: 100},
        {x_pos:3500, width: 100}
        
    ]
    
    collectables = [
        
        {x_pos: 1350, y_pos: 350, size: 50},
        {x_pos: 750, y_pos: 240, size: 50},
        {x_pos: -100, y_pos: 240, size: 50},
        {x_pos: 1000, y_pos: 350, size: 50},
        {x_pos: 200, y_pos: 310, size: 50},
        {x_pos: 2350, y_pos: 240, size: 50},
        {x_pos: 2500, y_pos: 210, size: 50},
        {x_pos: 3650, y_pos: 400, size: 50}
    ]
    
    game_score = 0;
    
     flagpole = {
            x_pos: 3000, 
            isReached: false
     }
    
    lives -= 1;
    
    enemies = [];
    
    enemies.push( new Enemy(0, floorPos_y,100));
    enemies.push( new Enemy(300, floorPos_y,100));
    enemies.push( new Enemy(900, floorPos_y,100));
    enemies.push( new Enemy(1900, floorPos_y,100));
    enemies.push( new Enemy(3200, floorPos_y,100));
    
}


function draw()
{
	background(25, 25, 112); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();
    translate(scrollPos, 0);
    
    drawClouds();
    drawMountains();
    drawTrees();
    
    // Collectables 
    
    for (var co = 0; co < collectables.length; co++)
        {
            if(!collectables[co].isFound)
                {
                drawCollectable(collectables[co]);
                checkCollectable(collectables[co]);
                }
        }
    
    // Canyons
    
    for(var ca = 0; ca < canyons.length; ca++)
        {
            {
            drawCanyon(canyons[ca]);
            checkCanyon(canyons[ca]);
            }
        }

    if (flagpole.isReached == false)
        {
            checkFlagpole();
        }
    
    if(lives > 0)
        {
            // Text to show players a secret collectable after the flagpole
            
            fill(255,255,255)
            textSize(25)
            textFont("Cooper Black")
            text("Secret Level", 3500, floorPos_y - 300)
            
            // draw fake platform to throw off players
            
            stroke(10)
            fill(255,249,155)
            rect(2250,floorPos_y - 150, 100, 20)
        }
    
    renderFlagpole();
    
 
    for(var i = 0; i < platforms.length; i++)
        {
            platforms[i].draw();
        }
    
    
    for(var i = 0; i < enemies.length; i++)
        {
            enemies[i].update();
            enemies[i].draw();
            if(enemies[i].isContact(gameChar_world_x,gameChar_y))
                {
                    startGame();
                    break;
                }
        }
    
    pop();
	// Draw game character.
    
	
	drawGameChar();
    
    fill(255,255,0);
    textSize(19)
    text("Points: " + game_score + " /8", 20, 40);

    text("Lives: " + lives, 20,60);


    for(i = 0; i < lives; i++)
    {
        noStroke();
        noFill()
        stroke(222, 183, 255)
        rect(900,10,110,40,30)
        fill(255,165,0);
        ellipse(920+30 * i,24,10.8,10.8);
        ellipse(930+30 * i,24,10.8,10.8);
        triangle(935+30 * i, 25, 925+30 * i, 40, 915+30*i, 25);
    }
    
    // Text to display when lives = 0 
    
    if(lives == 0)
    {
        noStroke()
        fill(255,0,0)
        textFont("Cooper Black")
        text("Game Over: Press Space to try again",width/2 - 100, height/2)
        themeSound = false;
        return;
    
    }
    
    // Text to display when game is finished (character reaches flagpole)

    else if(flagpole.isReached)
    {
        fill(255,0,0);
        text("Level Complete. You've collected " + game_score + " /8 stars: Press Space to play again", width/3 - 100, height/2)
        return;
    }
    
 
	// Logic to make the game character move or the background scroll.
    
    
    
	if(isLeft)
    {
        if(gameChar_x > width * 0.2)
        {
            gameChar_x -= 3;
        }
        else
        {
            scrollPos += 3;
        }
    }

    if(isRight)
    {
        if(gameChar_x < width * 0.8)
        {
            gameChar_x  += 3;
        }
        else
        {
            scrollPos -= 3; // negative for moving against the background
        }
    }

	// Logic to make the game character rise and fall.
    if(isLeft)
    {
        if(gameChar_x > width * 0.2)
        {
            gameChar_x -= 3;
        }
        else
        {
            scrollPos += 3;
        }
    }
        if(isRight)
    {
        if(gameChar_x < width * 0.8)
        {
            gameChar_x  += 3;
        }
        else
        {
            scrollPos -= 3; // negative for moving against the background
        }

    }

    {

        if(gameChar_y < floorPos_y)
        {
            var isContact = false;
            
            for(var i = 0; i < platforms.length; i++)
                {
                    if(
                        platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
                        {
                            isContact= true;
                            break;
                        }
                }
            if(isContact == false)
                {
            gameChar_y += 3;
            isFalling = true;
                }
            else{
                
                isFalling = false;
            }
        }
        else
        {
            isFalling = false;
        }

        if(isPlummeting)
        {
            gameChar_x += 5;
        }
        
        if(gameChar_y > height)
        {
            startGame();
            
        }

    }
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
    if(gameChar_y >= 700 && lives > 0)
        {
            startGame();
            
        }
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
	// if statements to control the animation of the character when W, A and D  keys are pressed.

	//open up the console to see how these work
	console.log("keyPressed: " + key);
	console.log("keyPressed: " + keyCode);
    
    if(!themeSong)
        {
            themeSound.play();
            themeSound.setVolume(0.1);
            themeSong = true;
        }
    
    
    if(key == "A" || keyCode == '65')
    {
        isLeft = true
    }
    
    if(key == "D" || keyCode == '68')
    {
        isRight = true
    }
    
    if(key == "W" )
    {
        if(!isFalling)
        gameChar_y -= 120;
        jumpSound.play();
        
    }
    
    if(lives == 0 && keyCode == "32")
        {
            startGame();
            lives = 3;
            themeSound.play();
        }
    if(flagpole.isReached && keyCode == "32")
        {
            startGame();
            lives = 3;
        }
    
}

function keyReleased()
{
	// if statements to control the animation of the character when A and D keys are released.

	console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);
    
    if(keyCode == 65 || key == '65')
    {
        isLeft = false
    }
    
    if(keyCode == 68 || key == '68')
    {
        isRight = false
    }
     
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    
    // If else Statement to add character code
    if(isLeft && isFalling)
	{
		// add your jumping-left code
        
        fill(0,0,0);
        rect(gameChar_x - 10,
            gameChar_y - 25,
            23,23, 5);

        fill(210,180,140)
        rect(gameChar_x - 10,
        gameChar_y - 20, 
            14, 6)
        fill(255,255,255)
        ellipse(gameChar_x - 6.5,
               gameChar_y - 17, 5, 2)
        ellipse(gameChar_x + 1.5,
               gameChar_y - 17, 5, 2)
        fill(0,0,0);
        ellipse(gameChar_x - 7.5,
               gameChar_y - 17,
               1,1)
        ellipse(gameChar_x + 0.5,
               gameChar_y - 17,
               1,1)
        fill(0)
        rect(gameChar_x - 10,
            gameChar_y - 12,
            23,10)
        fill(40,40,40)
        ellipse(gameChar_x - 2 ,
               gameChar_y + 0.5, 4,6)
        ellipse(gameChar_x + 5,
               gameChar_y + 0.5, 4,6)
        triangle(gameChar_x + 13,
                gameChar_y - 15,
                gameChar_x + 13,
                gameChar_y - 2,
                gameChar_x,
                gameChar_y - 8);
        fill(255,0,0);
        quad(gameChar_x,
            gameChar_y - 25,
            gameChar_x + 3,
            gameChar_y - 25,
            gameChar_x + 13,
            gameChar_y -  21,
            gameChar_x + 13,
            gameChar_y - 17);

        ellipse(gameChar_x + 14,
               gameChar_y - 20, 3,3)
        ellipse(gameChar_x + 16,
               gameChar_y - 18, 3,3)

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        
        fill(0,0,0)
        rect(gameChar_x - 10,
            gameChar_y - 25,
            23,23, 5);
        fill(210,180,140)
        rect(gameChar_x - 0.7,
             gameChar_y - 19,
             14,6);
        fill(255,255,255)
        ellipse(gameChar_x +3,
               gameChar_y - 16,
               4,2)
        ellipse(gameChar_x + 8.5,
               gameChar_y - 16,
               4,2);
        fill(0,0,0);
        ellipse(gameChar_x + 9.5,
               gameChar_y - 16, 1,1)
        ellipse(gameChar_x + 4,
               gameChar_y - 16,1,1)
        rect(gameChar_x,
            gameChar_y - 5,
             12.5,3)
        rect(gameChar_x - 10,
            gameChar_y - 5.5,
            13,3.5)
        fill(40,40,40)
        triangle(gameChar_x + 13,
                 gameChar_y - 10,
                 gameChar_x + 13,
                 gameChar_y - 2,
                 gameChar_x + 1,
                 gameChar_y - 6);
        ellipse(gameChar_x - 1,
               gameChar_y ,4,6)
        ellipse(gameChar_x + 5,
               gameChar_y ,4,6)
        fill(255,0,0)
        rect(gameChar_x - 10,
            gameChar_y - 22,23, 2)
        ellipse(gameChar_x - 11,
               gameChar_y - 25 , 4,4)
        ellipse(gameChar_x - 15,
               gameChar_y - 23 , 4,4)

	}
	else if(isLeft)
	{
		// add your walking left code
        
        fill(0,0,0);
         rect(gameChar_x - 10,
            gameChar_y - 25,
            23,23, 5);

        fill(210,180,140)
        rect(gameChar_x - 10,
        gameChar_y - 20, 
            14, 6)
        fill(255,255,255)
        ellipse(gameChar_x - 6.5,
               gameChar_y - 17, 5, 2)
        ellipse(gameChar_x + 1.5,
               gameChar_y - 17, 5, 2)
        fill(0,0,0);
        ellipse(gameChar_x - 7.5,
               gameChar_y - 17,
               1,1)
        ellipse(gameChar_x + 0.5,
               gameChar_y - 17,
               1,1)
        fill(0)
        rect(gameChar_x - 10,
            gameChar_y - 12,
            23,10)
        fill(40,40,40)
        ellipse(gameChar_x ,
               gameChar_y + 0.5, 9,5)
        triangle(gameChar_x + 13,
                gameChar_y - 15,
                gameChar_x + 13,
                gameChar_y - 2,
                gameChar_x,
                gameChar_y - 8);
        fill(255,0,0);
        quad(gameChar_x,
            gameChar_y - 25,
            gameChar_x + 3,
            gameChar_y - 25,
            gameChar_x + 13,
            gameChar_y -  21,
            gameChar_x + 13,
            gameChar_y - 17);

        ellipse(gameChar_x + 14,
               gameChar_y - 20, 3,3)
        ellipse(gameChar_x + 16,
               gameChar_y - 18, 3,3)

	}
	else if(isRight)
	{
		// add your walking right code
        
        fill(0,0,0)
        rect(gameChar_x - 10,
            gameChar_y - 25,
            23,23, 5);
        fill(210,180,140)
        rect(gameChar_x - 0.7,
             gameChar_y - 19,
             14,6);
        fill(255,255,255)
        ellipse(gameChar_x +3,
               gameChar_y - 16,
               4,2)
        ellipse(gameChar_x + 8.5,
               gameChar_y - 16,
               4,2);
        fill(0,0,0);
        ellipse(gameChar_x + 9.5,
               gameChar_y - 16, 1,1)
        ellipse(gameChar_x + 4,
               gameChar_y - 16,1,1)
        rect(gameChar_x,
            gameChar_y - 5,
             12.5,3)
        rect(gameChar_x - 10,
            gameChar_y - 5.5,
            13,3.5)
        fill(40,40,40)
        triangle(gameChar_x + 13,
                 gameChar_y - 10,
                 gameChar_x + 13,
                 gameChar_y - 2,
                 gameChar_x + 1,
                 gameChar_y - 6);
        ellipse(gameChar_x + 3,
               gameChar_y ,7,6)
        fill(255,0,0)
        rect(gameChar_x - 10,
            gameChar_y - 22,23, 2)
        ellipse(gameChar_x - 11,
               gameChar_y - 25 , 4,4)
        ellipse(gameChar_x - 15,
               gameChar_y - 23 , 4,4)

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        
        fill(0,0,0)
        rect(gameChar_x - 10,
            gameChar_y - 25,
            23,23, 5);
        fill(210,180,140)
        rect(gameChar_x - 5,
             gameChar_y - 19,
             14,6);
        fill(255,255,255)
        ellipse(gameChar_x - 1,
               gameChar_y - 16,
               4,2)
        ellipse(gameChar_x + 3.5,
               gameChar_y - 16,
               4,2);
        fill(0,0,0);
        ellipse(gameChar_x + 3.5,
               gameChar_y - 16, 1,1)
        ellipse(gameChar_x - 1,
               gameChar_y - 16,1,1)
        rect(gameChar_x,
            gameChar_y - 5,
             12.5,3)
        rect(gameChar_x - 10,
            gameChar_y - 5.5,
            13,3.5)
        fill(40,40,40)
        triangle(gameChar_x + 13,
                 gameChar_y - 10,
                 gameChar_x + 13,
                 gameChar_y - 2,
                 gameChar_x + 1,
                 gameChar_y - 6);
        ellipse(gameChar_x - 3,
               gameChar_y ,4,6)
        ellipse(gameChar_x + 5,
               gameChar_y, 4,6);
        fill(255,0,0)
        rect(gameChar_x - 10,
            gameChar_y - 22,23, 2)
        ellipse(gameChar_x - 11,
               gameChar_y - 25 , 4,4)
        ellipse(gameChar_x + 13,
               gameChar_y - 25 , 4,4)

	}
	else
	{
		// add your standing front facing code
        
            fill(210,180,140)
        rect(gameChar_x - 10, gameChar_y - 25, 20,20, 5);

        fill(0,0,0);
        rect(gameChar_x - 10,
             gameChar_y - 25,
             20,6, 5);
        rect(gameChar_x -10,
            gameChar_y - 25,
            4,20, 5 )
        rect(gameChar_x + 5,
            gameChar_y - 25,
            5,20, 5)
        rect(gameChar_x - 10,
             gameChar_y - 13,
             20,11);
        fill(255,255,255);
        noStroke(0);
        ellipse(gameChar_x - 3,
               gameChar_y - 16,
               4, 2) 
        ellipse(gameChar_x + 1.2,
               gameChar_y - 16,
               4, 2)
        fill(0,0,0)
        ellipse(gameChar_x - 3,
                gameChar_y - 16,
                1,1);
        ellipse(gameChar_x + 1,
                gameChar_y - 16,
                1,1);

        fill(5,5,5)
        triangle(gameChar_x - 9.5,
                gameChar_y - 13,
                gameChar_x - 9.5,
                gameChar_y - 2,
                gameChar_x + 10,
                 gameChar_y - 2);
        fill(40,40,40)
        triangle(gameChar_x + 10,
                 gameChar_y - 2,
                gameChar_x,
                gameChar_y - 8,
                gameChar_x + 10,
                gameChar_y - 13);

        fill(255,0,0);
        quad(gameChar_x - 9.5,
            gameChar_y - 22,
            gameChar_x - 9.5,
            gameChar_y - 16,
            gameChar_x - 1.5,
            gameChar_y - 25,
            gameChar_x - 7.5,
            gameChar_y - 25);

        ellipse(gameChar_x - 11.5 ,
                gameChar_y - 20, 3,3);
        ellipse(gameChar_x - 12,
               gameChar_y - 17.5,
               3,3);
        fill(0,0,0);
        rect(gameChar_x - 5,
            gameChar_y - 2,
             4,4.5)
        rect(gameChar_x + 2,
            gameChar_y - 2,
             4,4.5)

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

    function drawClouds()
{
    for(var c = 0; c < clouds.length; c++)
        {
            clouds[c].x_pos = clouds[c].x_pos-1*clouds[c].speed; //move cloud

            if(clouds[c].x_pos < gameChar_world_x - 2000 || clouds[c].x_pos > gameChar_world_x + 1500 )
        {
            clouds[c].x_pos = gameChar_world_x + 1500;
        }
            
            
            fill(255,255,255)
            ellipse(clouds[c].x_pos + 50,
                    clouds[c].y_pos - 25,
                    100,
                    60);
            ellipse(clouds[c].x_pos + 125,
                    clouds[c].y_pos - 25,
                    100,
                    60);
            ellipse(clouds[c].x_pos + 80,
                    clouds[c].y_pos - 50,
                    100,
                    60);

            fill(255,255,255);
            ellipse(clouds[c].x_pos + 375,
                    clouds[c].y_pos - 25,
                    100,
                    60);
            ellipse(clouds[c].x_pos + 450,
                    clouds[c].y_pos - 25,
                    100,
                    60);
            ellipse(clouds[c].x_pos + 410,
                    clouds[c].y_pos - 50,
                    100,
                    60);

            fill(255,255,255);
            ellipse(clouds[c].x_pos + 675,
                    clouds[c].y_pos - 25,
                    100,
                    60);
            ellipse(clouds[c].x_pos + 750,
                    clouds[c].y_pos - 25,
                    100,
                    60);
            ellipse(clouds[c].x_pos + 710,
                    clouds[c].y_pos - 50,
                    100,
                    60);
        }
}

// Function to draw mountains objects.

    function drawMountains()
{
    for (var m = 0; m < mountains.length; m++)

        {
        stroke(0,0,0)
        fill(119,136,153)    
        triangle(mountains[m].x_pos + 435,
                 mountains[m].y_pos + 100,
                 mountains[m].x_pos + 300,
                 mountains[m].y_pos + 332,
                 mountains[m].x_pos + 500,
                 mountains[m].y_pos + 332);
        fill(255,255,255)
        triangle(mountains[m].x_pos + 435,
                 mountains[m].y_pos + 97,
                 mountains[m].x_pos + 400,
                 mountains[m].y_pos + 160,
                 mountains[m].x_pos + 452,
                 mountains[m].y_pos + 160);
        stroke(0,0,0)
        fill(128,128,128)
        triangle(mountains[m].x_pos + 500,
                 mountains[m].y_pos + 332,
                 mountains[m].x_pos + 550,
                 mountains[m].y_pos + 100,
                 mountains[m].x_pos + 650,
                 mountains[m].y_pos + 332);
        fill(255,255,255)
        triangle(mountains[m].x_pos + 550,
                 mountains[m].y_pos + 90,
                 mountains[m].x_pos + 542,
                 mountains[m].y_pos + 140,
                 mountains[m].x_pos + 567,
                 mountains[m].y_pos + 140)
        stroke(0,0,0)
        fill(90,90,90)
        triangle(mountains[m].x_pos + 410,
                 mountains[m].y_pos + 332,
                 mountains[m].x_pos + 575,
                 mountains[m].y_pos + 332,
                 mountains[m].x_pos + 490,
                 mountains[m].y_pos + 25);
        fill(255,255,255)
        triangle(mountains[m].x_pos + 490,
                 mountains[m].y_pos + 22,
                 mountains[m].x_pos + 474,
                 mountains[m].y_pos + 90,
                 mountains[m].x_pos + 508,
                 mountains[m].y_pos + 90);
        
    }
}

// Function to draw trees objects.

    function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
        {
             noStroke();
            fill(139,69,19)
            rect(trees_x[i] - 7.5,
                 floorPos_y - 32,
                 15,
                 35)
            fill(34,139,34)
            triangle(trees_x[i] + 0.5,
                     floorPos_y - 57,
                     trees_x[i] - 27.5,
                     floorPos_y - 32,
                     trees_x[i] + 27.5,
                     floorPos_y - 32);
            triangle(trees_x[i] + 0.5,
                     floorPos_y - 82,
                     trees_x[i] - 27.5,
                     floorPos_y - 42,
                     trees_x[i] + 27.5,
                     floorPos_y - 42);
            triangle(trees_x[i] + 0.5,
                     floorPos_y - 107,
                     trees_x[i] - 27.5,
                     floorPos_y - 52,
                     trees_x[i] + 27.5,
                     floorPos_y - 52);
            triangle(trees_x[i] + 0.5,
                     floorPos_y - 132,
                     trees_x[i] - 27.5,
                     floorPos_y - 62,
                     trees_x[i] + 27.5,370);
            triangle(trees_x[i] + 0.5,
                     floorPos_y - 157,
                     trees_x[i] - 27.5,
                     floorPos_y - 72,
                     trees_x[i] + 27.5,
                     floorPos_y - 72);
            fill(255,255,255);
            triangle(trees_x[i] + 0.5,
                     floorPos_y - 157,
                     trees_x[i] - 15.5,
                     floorPos_y - 112,
                     trees_x[i] + 16.5,
                     floorPos_y - 112);
        }
    
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(25,25,112)
    rect(t_canyon.x_pos ,
         floorPos_y,
         t_canyon.width,
         147);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + 100 && gameChar_y >= floorPos_y)
        {
            isPlummeting = true;
            gameChar_y += 10;
            isLeft = false;
            isRight = false;
            deathSound.play();
        }
    else
    {
        isPlummeting = false;
    }

}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    
            noStroke();
            fill(255,69,0)
            triangle(t_collectable.x_pos - 10,
                         t_collectable.y_pos + 5,
                         t_collectable.x_pos + 15,
                         t_collectable.y_pos + 5,
                         t_collectable.x_pos + 2,
                         t_collectable.y_pos - 20);
            fill(255,69,0)
            triangle(t_collectable.x_pos + 3,
                         t_collectable.y_pos + 12,
                         t_collectable.x_pos + 15,
                         t_collectable.y_pos - 10,
                         t_collectable.x_pos - 10,
                         t_collectable.y_pos - 10);

}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{

    var d = dist(gameChar_world_x,
                 gameChar_y,
                 t_collectable.x_pos, t_collectable.y_pos);

    if(d < 50)
    {
        t_collectable.isFound = true;
        game_score += 1; 
    }
}

// Draw flagpole to end game. Initialised at false

function renderFlagpole()
{
    
    if(flagpole.isReached == false)
    {
        fill(192, 192, 192);
        rect(flagpole.x_pos, floorPos_y - 100, 10, 100);
        fill(255, 0, 0);
        rect(flagpole.x_pos, floorPos_y - 100, 60, 40);
        
    }
    else{
        fill(192, 192, 192);
        rect(flagpole.x_pos, floorPos_y - 100, 10, 100);
        fill(0, 255, 127);
        rect(flagpole.x_pos, floorPos_y - 100, 60, 40);
    }
}

//checkFlagpole();

function checkFlagpole()
{
    if(dist(gameChar_world_x, gameChar_y, flagpole.x_pos, floorPos_y) < 20)
    {
        flagpole.isReached = true;
        finishSound.play();
    }
    else
    {
        flagpole.isReached = false;
    }
}

function createPlatform(x,y,length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(255,255,0);
            stroke(0);
            rect(this.x, this.y, this.length, 20)
        },
        
        checkContact: function(gc_x, gc_y)
        {
            // Checks whether Character is in contact with the platform
            
            if(gc_x > this.x && gc_x < this.x + this.length)
                {
                    var d = this.y - gc_y;
                    if( d >= 0 && d < 5 )
                        {
                        return true;
                        }
                    
                }
            return false;
        }
    }
    
    return p;
}

// Draw enemy/ functions

function Enemy(x,y,range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 1;
    
    this.draw = function()
    {
        stroke(0)
        fill(255,255,255)
        rect(this.current_x,this.y - 50, 30,45,10)
        noStroke()
        fill(233,150,122)
        rect(this.current_x + 5, this.y -40, 20,15,5)
        stroke(0)
        fill(255,255,255)
        ellipse(this.current_x + 13, this.y - 34,6)
        fill(255,255,255)
        stroke(0)
        ellipse(this.current_x + 20, this.y - 34,6)
        noStroke()
        fill(0)
        ellipse(this.current_x + 14, this.y - 34, 2)
        ellipse(this.current_x + 20, this.y -34, 2)
        stroke(0)
        fill(255,255,255)
        ellipse(this.current_x + 11, floorPos_y - 2, 10,5)
        ellipse(this.current_x + 22, floorPos_y - 2, 10,5)
        noStroke()
        fill(170,170,170)
        triangle(this.current_x + 1, this.y - 25, this.current_x + 20, this.y - 16, this.current_x + 1, this.y - 12)
        fill(200,0,0)
        rect(this.current_x,this.y - 45, 30,5,6)
        ellipse(this.current_x - 3, this.y -45,5,5)
        ellipse(this.current_x + 34, this.y -45,5,5)
        
    }
    
    // Make Enemy Move
    
    this.update = function()
    {
        this.current_x += this.incr
        if(this.current_x < this.x)
            {
                this.incr = 1
            }
        else if(this.current_x > this.x + this.range)
            {
                this.incr = -1;
            }
    }
    
    // Collision Code for Enemy
    
    this.isContact = function(gc_x, gc_y)
    {
        //Returns true if contact is made
        var d = dist(gc_x, gc_y, this.current_x, this.y)
        
        if(d < 25)
            {
                return true;
            }
        return false;
    }
    
    
}

