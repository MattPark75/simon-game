/**
 * SIMON GAME - simon.js v9.1
 * 
 * 03/2023 - Mathieu Dellon
 */


const cfg = {
    SOUNDS_PATH: "sounds/"
};


function Simon () {
    var that = this;
        
    this.level = 0,
    this.hiScore = localStorage.getItem('hiScore') || 0,
    this.isFirstMove = true, // 1st CPU move => no timeout
    this.isPlayersTurn = false,
    this.originalSQ = [],  // CPU sequence
    this.playerSQ = [];    // player sequence

    /** init
     * 
     */
    this.init = function() {
        var audio;

        console.log("*** init()");
        that.update_hiscore();

        // event listeners
        $("div.btn").on("click", function() {
            var el = this;

            if ($(el).attr("id") !== "start") {
                // play sound when clicked
                audio = new Audio(cfg.SOUNDS_PATH + $(el).attr("id") + ".mp3");
                audio.addEventListener("canplaythrough", (e) => {
                    audio.play();
                });

                // animate buttons when clicked
                $(el).addClass("pressed");
                setTimeout(function() {
                    console.log(el);
                    $(el).removeClass("pressed");
                }, 100)

                // if game is started check player's sequence (player's turn)
                if (that.isPlayersTurn) {
                    that.playerSQ.push($(el).attr("id"));
                    that.players_turn();
                }
            }
        });

        // Keydown event listener
        that.set_start_key();

        // Start button
        $("div.btn#start").on("click", function() {
            $(document).trigger("keydown");
        });

    }

    /** set_start_key
     * Set the event listener for keydown to start a game
     */
    this.set_start_key = function() {
        $(document).one("keydown", function(e) {
            that.start_game();
        });
    }

    /** start
     * Start a new game
     */
    this.start_game = function() {

        // reset sequences & title
        that.update_hiscore();
        that.originalSQ = [];
        that.playerSQ = [];
        that.isFirstMove = true;
        $("#level-title").text("Level 0");        
        that.cpus_turn();
    }

    /** cpus_turn and players_turn
     * 
     */
    this.cpus_turn = function() {
        var 
            t = (!that.isFirstMove) ? 700 : 0,
            newColor = that.random_color();

        that.originalSQ.push(newColor);
        setTimeout(function() {
            $("div.btn#" + newColor).trigger("click");
            that.isPlayersTurn = true;
        }, t);
    }
    this.players_turn = function() {
        var 
            isWrong = false,
            i = that.playerSQ.length,  // index of the last move 
            j = that.originalSQ.length;

        that.isFirstMove = false;

        // if played too many moves
        if (i > j) { isWrong = true; }

        // check if last move is correct
        isWrong = (that.playerSQ[i - 1] === that.originalSQ[i - 1]) ? false : true;

        if (!isWrong && i === j) {
            that.isPlayersTurn = false;
            that.playerSQ = [];
            that.level++;

            // update hiScore
            if (that.level > Number(that.hiScore)) {
                that.hiScore = that.level;
                localStorage.setItem('hiScore', that.level);
                that.update_hiscore();
            }
            
            // Display level
            $("#level-title").text("Level " + that.level);

            // start next level
            that.cpus_turn();
        }
        else if (!isWrong && i < j) {
            that.isPlayersTurn = true;
        }
        else {
            that.game_over();
        }
    }

    /** error
     * when player makes a wrong move
     */
    this.game_over = function() {
        var 
            i, 
            audio = new Audio(cfg.SOUNDS_PATH + "wrong.mp3");

        audio.play();
        $("#level-title").html("Game Over!");
        for (i=1; i<3; i++) {
            $("body").removeClass("game-over");
        }    

        // reset game and event listener
        that.isPlayersTurn = false;
        that.isFirstMove = true;
        that.level = 0;
        that.set_start_key();
    }

    /** update_hiscore
     * 
     */
    this.update_hiscore = function() {
        $("#hiscore").text("Hi-Score: " + that.hiScore);
    }

    /** random_color
     * pick a random color
     * 
     * return: (string) 
     */
    this.random_color = function() {
        var 
            colors = ["green", "red", "yellow", "blue"],
            nb = Math.floor(Math.random() * 4);
        
        return colors[nb];
    }
}

$(document).ready(function() {
    var simon = new Simon();
    simon.init();
});