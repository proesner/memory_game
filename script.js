// setup variables
let $memoryGame = $('#memory-game');
let $mainControls = $('#main-controls');
let $timer = $('#timer');
let $restartBtn = $mainControls.find('#restart');
let $movesEl = $mainControls.find('#moves span');
let $ratingEl = $mainControls.find('#diamond-rating');
let $ratingElItems = $ratingEl.find('i');
let $diamondsEl = $ratingEl.html();

let cardSymbol = ["address-book", "address-book",
    "adjust", "adjust",
    "area-chart", "area-chart",
    "asl-interpreting", "asl-interpreting",
    "audio-description", "audio-description",
    "bank", "bank",
    "battery-4", "battery-4",
    "bell", "bell",
    "bluetooth", "bluetooth",
    "calculator", "calculator",
    "camera-retro", "camera-retro",
    "coffee", "coffee"
];

let flipped = [];
let match = 0;
let moves = 0;
let standardDelay = 1000;
let longDelay = standardDelay * 2;
let cardPairs = cardSymbol.length / 2;
let diamonds;

// game timer
// Reference: https://stackoverflow.com/questions/19429890/javascript-timer-just-for-minutes-and-seconds
let sec = 0;
let min = 0;
let getTime;
let intId;
let timerHandler = function() {
    if (sec == 60) {
        sec = 0;
        min++;
        if (min == 60) min = 0;
    }
    return (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
};

/**
* @description Shuffle the deck
* @param {array} Takes in list of icon class names
* @returns {array} Icon class names random order
Reference: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
*/
function shuffle(a) {
    let j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}

/**
* @description Initialize the games proper letiables and shuffle deck of cards.
               Render cards to HTML in for loop.
*/
function go() {
    $memoryGame.empty(); // clear deck
    shuffle(cardSymbol);
    // reset vars
    match = 0;
    moves = 0;
    sec = 0;
    min = 0;
    diamonds = 3;
    $ratingEl.html($ratingElItems);
    $movesEl.html(moves);
    $timer.text(timerHandler());

    clearInterval(intId);
    intId = null;
    for (let i = 0; i < cardSymbol.length; i++) {
        $memoryGame.append($('<li class="card white-shadow animated"><i class="fa fa-' +
            cardSymbol[i] + '"></i></li>'));
    }
}

/**
* @description Set star rating and track diamond count. Set diamond value depending on move value.
* @param {number} Takes value from current move value
* @returns {array} Object key:value pair to use later
Reference: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
*/
function setDiamonds(moves) {
    if (moves > 2 && moves < 20) {
        $ratingElItems.eq(2).remove();
        diamonds = 2;
    } else if (moves > 21 && moves < 30) {
        $ratingElItems.eq(1).remove();
        diamonds = 1;
    }
    console.log(diamonds);
    return {
        diamonds
    };
}

// on click card behavior
// Reference: https://stackoverflow.com/questions/9478413/not-selector-on-click-event
$memoryGame.on('click', '.card:not(".match, .open")', function() {
    if (!intId) {
        intId = setInterval(function () {
            sec++;
            $timer.text(timerHandler());
        }, 1000);
    }
    if ($('.opened').length > 1) {
        return true;
    } //if card opened, no click event on that card
    let $this = $(this);
    let card = $this.get(0).innerHTML;

    $this.addClass('open opened flipInY');
    flipped.push(card); // put i element into array, compare later

    // compare with first flipped card to compare match or no match
    if (flipped.length > 1) {
        setTimeout(function() {
            $memoryGame.find('.open').removeClass('flipInY');
        }, standardDelay);
        if (card === flipped[0]) {
            // if match, add match class, animate bounce
            setTimeout(function() {
                $memoryGame.find('.open').addClass('match infinite bounce');
            }, standardDelay);
            setTimeout(function() {
                $memoryGame.find('.match').removeClass('open opened infinite bounce');
            }, longDelay);
            match++; // verified match count up
        } else {
            setTimeout(function() {
                $memoryGame.find('.open').removeClass('open opened');
            }, standardDelay);
        }

        flipped = []; // reset flipped array to compare new set
        moves++; // plus one for moves
        setDiamonds(moves);
        $movesEl.html(moves);
    }

    // endgame if all cards are flipped
    if (cardPairs === match) {
        clearInterval(intId);
        setTimeout(function() {
            alertify.confirm('Congrats! It took you ' + timerHandler() + ' in ' + moves +
                ' moves, and have ' + diamonds + ' diamonds left. Would you like to play again?',
                function() {
                    go(); // restart game
                },
                function() {
                    return; // cancel button
                });
        }, standardDelay);
    }
})

// on click, restart game
$restartBtn.on('click', function() {
    alertify.confirm('Are you sure you want to restart the game!?',
        function() {
            go(); // restart game
        },
        function() {
            return; // cancel button
        });
})

// start game
go();
