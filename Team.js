/*
Over the course of this assignment you are going to put together a function which uses 
constructors and user input to create and manage a team of players.


Start out by creating a constructor function called "Player" with the following properties 
and methods...

Player name: Property which contains the player's name
Position: Property which holds the player's position
Offense: Property which is a value between 1 and 10 to show how good this player is on offense
Defense: Property which is a value between 1 and 10 to show how good this player is on defense
GoodGame: Method which increases either the player's offense or defense property based upon a coinflip.
BadGame: Method which decreases either the player's offense or defense property based upon a coinflip.
PrintStats: Method which prints all of the player's properties to the screen
*/

//DEPENDANCY FOR inquirer NPM PACKAGE
var inquirer = require('inquirer');

function Player(name, position, offense, defense) {
	this.name = name;
	this.position = position;
	this.offense = offense;
	this.defense = defense;

	this.goodGame = function(coinflip){
		// Random number from 1-2 to increase offense/defense by 1 based on 
		// a simulated coinflip.  i.e. Heads == 1, Tails == 2
		// If Heads, increase offense. Tails, increase defense.
		var coinflip = Math.floor((Math.random() * 2) + 1);

		coinflip == 1 ? ++this.offense : ++this.defense;
	}

	this.badGame = function(coinflip){
		// Random number from 1-2 to increase offense/defense by 1 based on 
		// a simulated coinflip.  i.e. Heads == 1, Tails == 2
		// If Heads, increase offense. Tails, increase defense.
		var coinflip = Math.floor((Math.random() * 2) + 1);

		coinflip == 1 ? --this.offense : --this.defense;
	}

	this.printStats = function() {
		console.log("Name: " + this.name + "\n" +
					"Position: " + this.position + "\n" +
					"Offensive Strength: " + this.offense + "\n" +
					"Defensive Strength: " + this.defense + "\n");
	}
}


/*
Now create a program which allows you to create 8 unique players; 5 starters and 3 subs.

Once all of the players have been created, print their stats.
*/

function Team() {
	this.count = 0;
	this.players = [];
}

function Game() {
	console.log("Start: Game()");

	// Keep track of this game for the call to the anon function called by Prompt.then()
	var thisGame = this;

	// Initialize game states
	this.initStartTeamState = 0;
	this.initSubTeamState = 1;
	this.playState = 2;

	this.state = this.initStartTeamState;

	// Initialize teams
	this.startingTeam = new Team();
	this.startTCount = 3;  // Will be 8
	this.subTeam = new Team();
	this.subTCount = 2;  // Will be 3
	this.currentTeam = this.startingTeam;
	this.maxCount = this.startTCount;

	this.start = function() {
		// Start by calling getPlayers to initialize the starting team.
		// Since this is called asynchronously, we need to wait until it
		// is done before initializing the sub players so that will be called
		// seperately after in the Prompt.then();
		this.getPlayers();
	}

	this.getPlayers = function() {
	    //IF STATEMENT TO ENSURE THAT OUR QUESTIONS ARE ONLY ASKED 8 TIMES
	    if (thisGame.currentTeam.count < thisGame.maxCount) {
	        console.log("NEW PLAYER")
	        //RUNS INQUIRER AND ASKS THE USER A SERIES OF QUESTIONS WHOSE REPLIES ARE STORED WITHIN 
	        //THE VARIABLE answers INSIDE OF THE .then STATEMENT.
	        inquirer.prompt([{
	            name: "name",
	            message: "What is your name?"
	        }, {
	            name: "position",
	            message: "What is your current position?"
	        }, {
	            name: "offense",
	            message: "What is your offensive strength?"
	        }, {
	            name: "defense",
	            message: "What is your defensive strength?"
	        }]).then(function(answers) {
console.log("Here 1: " + answers);
	            //INITIALIZES THE VARIABLE newGuy TO BE A Player OBJECT WHICH WILL TAKE IN ALL OF 
	            //THE USER'S ANSWERS TO THE QUESTIONS ABOVE
	            var newGuy = new Player(answers.name, answers.position, answers.offense, answers.defense);
console.log("Here 2: " + answers);
	            //PUSHES newGuy OBJECT INTO OUR ARRAY
	            thisGame.currentTeam.players.push(newGuy);
console.log("Here 3: " + answers);
	            //ADD ONE TO COUNT TO INCREMENT OUR RECURSIVE LOOP BY ONE
	            thisGame.currentTeam.count++;
console.log("Here 4: " + answers);
	            //RUN THE getPlayers FUNCTION AGAIN SO AS TO EITHER END THE LOOP OR 
	            //ASK THE QUESTIONS AGAIN
	            thisGame.getPlayers();
console.log("Here 5: " + answers);
	        })
	        //ELSE STATEMENT WHICH RUNS A FOR LOOP THAT WILL EXECUTE .printInfo() 
	        //FOR EACH OBJECT INSIDE OF OUR ARRAY
	    } else {
	        for (var x = 0; x < thisGame.currentTeam.players.length; x++) {
	            thisGame.currentTeam.players[x].printStats();
	        }

	        // Check the current state of the game to determine what to do next
	        switch(thisGame.state){
	        	case thisGame.initStartTeamState:
					console.log("initStartTeam State: " + thisGame.state);
		        	thisGame.state = thisGame.initSubTeamState;
					thisGame.currentTeam = thisGame.subTeam;
					thisGame.maxCount = thisGame.subTCount;
					thisGame.getPlayers();
					break;
				case thisGame.initSubTeamState:
					console.log("initSubTeam State: " + thisGame.state);
					thisGame.state = thisGame.playState;
					thisGame.play();
					break;
				case thisGame.playState:
					console.log("play State: " + thisGame.state);
					// ignore for now
					break;
				default:
					console.log("Invalid State: " + thisGame.state);
	        }
	    }
	}

	/*
	Once your code is functioning properly, move on to create a function called 
	"playGame" (it is called simply "play" here) which will be run once all of 
	your players have been created and will do the following...

	Loops 10 times

	Each time the function loops, two random numbers between 1 and 50 are rolled and compared against 
	your starter's offensive and defensive stats.

	If the first number is lower than the sum of your team's offensive stat, add one point to your 
	team's score.

	If the second number is higher than the sum of your team's defensive stat, remove one point 
	from your team's score.

	After the score has been changed, you may choose to substitute any of your players within the 
	starters array with any of those players within the subs array.

	If your score is positive after the game has finished, run goodGame() for all of those players 
	currently within the starters array. If your score is negative after the game has finished, run 
	badGame() for all of those players currently within your starters array. If the score is equal 
	to zero, then do nothing.

	Prompts the player if they would like to play again: runs playGame from the start once more if 
	they do and ends the program if they don't.
	HINT: Remember to use recursion when looping with inquirer! Otherwise your program might not 
	return the prompts as you expect.

	HINT: It has been a while since we have worked with random numbers explicitly. If you are 
	having troubles, look up Math.random on Google and you should find some resources to help.
	*/
	this.play = function() {
		console.log("Start: this.play");

		for (var i=0; i < 10; i++) {
			var roll1 = Math.floor((Math.random() * 50) + 1);
			var roll2 = Math.floor((Math.random() * 50) + 1);
		}

		console.log("End: this.play");
	}

	console.log("End: Game()");
}

var game = new Game();

game.start();

