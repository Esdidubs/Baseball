// FOR NOW, ASSUME RUNNERS ONLY PUSHED WHEN FORCED TO MOVE. MAY REVISIT LATER.

let dice1Roll = 1;
let dice2Roll = 1;
let diceResult = 0;
let diceResultObject;
let diceResultDesc = "";

let homeScore = 0;
let awayScore = 0;
let inning = 1;
let inningSide = "top";
let outCount = 0;
let firstBase = false;
let secondBase = false;
let thirdBase = false;

const outsPerInning = 3;
const inningsPerNormalGame = 9;

let diceRollChart = [
    { rollValue: 2, rollResult: "home run" },
    { rollValue: 3, rollResult: "triple" },
    { rollValue: 4, rollResult: "double" },
    { rollValue: 5, rollResult: "single" },
    { rollValue: 6, rollResult: "out" },
    { rollValue: 7, rollResult: "out" },
    { rollValue: 8, rollResult: "out" },
    { rollValue: 9, rollResult: "single" },
    { rollValue: 10, rollResult: "double" },
    { rollValue: 11, rollResult: "triple" },
    { rollValue: 12, rollResult: "home run" },
];

$(document).on("click", "#settings", function () {
    event.preventDefault();
    $("#help-box").show();
});

$(document).on("click", "#exit", function () {
    event.preventDefault();
    $("#help-box").hide();
});

var intervalID;
var rollInterval;

function shuffleDice() {
    let shuffle1Roll = Math.floor(Math.random() * 6) + 1;
    let shuffle2Roll = Math.floor(Math.random() * 6) + 1;
    $("#die-1").attr("src", `images/die${shuffle1Roll}.png`);
    $("#die-2").attr("src", `images/die${shuffle2Roll}.png`);
}

function startRoll() {
    intervalID = setInterval(shuffleDice, 30);

    rollInterval = setInterval(stop, 800);
    $("#roll-button").prop("disabled", true);
}

// Function to stop setInterval call
function stop() {
    clearInterval(intervalID);
    clearInterval(rollInterval);
    rollDice();
    $("#roll-button").prop("disabled", false);
}

updateDisplay();

function updateDisplay() {
    $("#die-1").attr("src", `images/die${dice1Roll}.png`);
    $("#die-2").attr("src", `images/die${dice2Roll}.png`);
    $("#roll-result").text(diceResultDesc);
    $("#home-score").text(homeScore);
    $("#away-score").text(awayScore);
    $("#inning-count").text(inning);
    $("#inning-side").text(inningSide);
    if (outCount == 1) {
        $("#out-1").css("background-color", "#c92626");
        $("#out-2").css("background-color", "#ffffff");
    } else if (outCount == 2) {
        $("#out-1").css("background-color", "#c92626");
        $("#out-2").css("background-color", "#c92626");
    } else {
        $("#out-1").css("background-color", "#ffffff");
        $("#out-2").css("background-color", "#ffffff");
    }
    $("#out-count").text(outCount);
    firstBase ? $("#first-base").css("background-color", "#c92626") : $("#first-base").css("background-color", "#ffffff");
    secondBase ? $("#second-base").css("background-color", "#c92626") : $("#second-base").css("background-color", "#ffffff");
    thirdBase ? $("#third-base").css("background-color", "#c92626") : $("#third-base").css("background-color", "#ffffff");
}

function rollDice() {
    dice1Roll = Math.floor(Math.random() * 6) + 1;
    dice2Roll = Math.floor(Math.random() * 6) + 1;
    diceResult = dice1Roll + dice2Roll;
    diceResultObject = diceRollChart.find((x) => x.rollValue === diceResult);
    diceResultDesc = diceResultObject.rollResult;

    switch (diceResultDesc) {
        case "out":
            handleOut();
            break;
        case "single":
            handleSingle();
            break;
        case "double":
            handleDouble();
            break;
        case "triple":
            handleTriple();
            break;
        case "home run":
            handleHomerun();
            break;
    }

    updateDisplay();
}

function handleOut() {
    outCount++;
    if (outCount === outsPerInning) {
        inningChange();
    }
}

function handleSingle() {
    if (!firstBase && !secondBase && !thirdBase) {
        firstBase = true;
    } else if (firstBase && !secondBase && !thirdBase) {
        secondBase = true;
    } else if (firstBase && secondBase && !thirdBase) {
        thirdBase = true;
    } else if (firstBase && !secondBase && thirdBase) {
        secondBase = true;
    } else if (firstBase && secondBase && thirdBase) {
        scoreRun(1);
    } else if (!firstBase && secondBase && !thirdBase) {
        firstBase = true;
    } else if (!firstBase && secondBase && thirdBase) {
        firstBase = true;
    } else if (!firstBase && !secondBase && thirdBase) {
        firstBase = true;
    }
}

function handleDouble() {
    if (!firstBase && !secondBase && !thirdBase) {
        secondBase = true;
    } else if (firstBase && !secondBase && !thirdBase) {
        firstBase = false;
        secondBase = true;
        thirdBase = true;
    } else if (firstBase && secondBase && !thirdBase) {
        firstBase = false;
        secondBase = true;
        thirdBase = true;
        scoreRun(1);
    } else if (firstBase && !secondBase && thirdBase) {
        firstBase = false;
        secondBase = true;
        scoreRun(1);
    } else if (firstBase && secondBase && thirdBase) {
        firstBase = false;
        secondBase = true;
        thirdBase = true;
        scoreRun(2);
    } else if (!firstBase && secondBase && !thirdBase) {
        thirdBase = true;
    } else if (!firstBase && secondBase && thirdBase) {
        scoreRun(1);
    } else if (!firstBase && !secondBase && thirdBase) {
        secondBase = true;
    }
}

function handleTriple() {
    if (!firstBase && !secondBase && !thirdBase) {
        thirdBase = true;
    } else if (firstBase && !secondBase && !thirdBase) {
        firstBase = false;
        thirdBase = true;
        scoreRun(1);
    } else if (firstBase && secondBase && !thirdBase) {
        firstBase = false;
        secondBase = false;
        thirdBase = true;
        scoreRun(2);
    } else if (firstBase && !secondBase && thirdBase) {
        firstBase = false;
        secondBase = false;
        scoreRun(2);
    } else if (firstBase && secondBase && thirdBase) {
        firstBase = false;
        secondBase = false;
        thirdBase = true;
        scoreRun(3);
    } else if (!firstBase && secondBase && !thirdBase) {
        secondBase = false;
        thirdBase = true;
        scoreRun(1);
    } else if (!firstBase && secondBase && thirdBase) {
        secondBase = false;
        scoreRun(2);
    } else if (!firstBase && !secondBase && thirdBase) {
        thirdBase = true;
        scoreRun(1);
    }
}

function handleHomerun() {
    scoreRun(firstBase + secondBase + thirdBase + 1);
    firstBase = false;
    secondBase = false;
    thirdBase = false;
}

function inningChange() {
    if (inningSide === "top") {
        if (inning >= 9) {
            if (homeScore > awayScore) {
                handleGameOver();
            } else {
                inningSide = "bottom";
                inningWipe();
            }
        } else {
            inningSide = "bottom";
            inningWipe();
        }
    } else {
        if (inning >= 9) {
            if (homeScore !== awayScore) {
                handleGameOver();
            } else {
                inningSide = "top";
                inning++;
                inningWipe();
            }
        } else {
            inningSide = "top";
            inning++;
            inningWipe();
        }
    }
}

function inningWipe() {
    diceResultDesc = "switch";
    firstBase = false;
    secondBase = false;
    thirdBase = false;
    outCount = 0;
}

function scoreRun(numberOfRuns) {
    if (inningSide == "top") {
        awayScore += numberOfRuns;
    } else {
        homeScore += numberOfRuns;
        if (inning >= 9 && homeScore > awayScore) {
            handleGameOver();
        }
    }
}

function handleGameOver() {
    homeScore > awayScore ? (diceResultDesc = "home wins") : (diceResultDesc = "away wins");
    $("#roll-button").prop("disabled", true);
}
