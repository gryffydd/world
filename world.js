/*
 * World is based on Predator Prey relationships where there are multiple
 * species
 *
 * The idea is that a species is identified by a genome.  The genome is
 * encoded in DNA which can be thought of as a series of ones and zeros
 * which can be also thought of as a number.
 *
 * Each species can be though of as having attributes expressed by the genome.
 * In identifying what is a Predator and what is Prey we will make a rule that
 * a species can eat another if it has one less bit.
 */

/*
 * Given that there can be many species, for the 'World' we will set a
 * maximum.
 */

var MAX_SPECIES = 16;
var MAX_FOOD = 2 ^ 30;
var MUTATION = 2 ^ 20;

var population = new Array(MAX_SPECIES);

/* A helper function to set an array to a value */

function initialise_population (p) {
    for (i = 0; i < MAX_SPECIES; i++) {
        p[i] = 0;
    }
    p[0] = 1;
}

/* The Predator / Prey functions */

function level(x) {
    var l = 0;
    while (x > 0) {
        l += (x & 1);
        x = x >> 1;
    }
    return l;
}

function prey(x, y) {
    if (level(x) == level(y) + 1) {
        if ((x & y) == y) {
            return true;
        }
    }
    return false;
}

/* The display plotting functions */

function display_populations () {
    textSize(16);
    textAlign(CENTER, CENTER);

    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            var c = 192 - level(x * 4 + y) * 32;
            fill([255, c, c]);
            noStroke();
            rect(x * 180 + 20, y * 180 + 20, 160, 160);
            fill([0, 0, 0]);
            text(population[x * 4 + y], x * 180 + 100, y * 180 + 100);
        }
    }
}

/* The plotting functions */

function setup() {
    createCanvas(740, 740);

    fill([51, 51, 51]);
    noStroke();
    rect(0, 0, 740, 740);

    initialise_population(population);

    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            var c = 192 - level(x * 4 + y) * 32;
            fill([255, c, c]);
            noStroke();
            rect(x * 180 + 20, y * 180 + 20, 160, 160);
        }
    }

    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            var t = 'Pop: ' + population[x * 4 + y];
            fill([0, 0, 0]);
            textSize(16);
            textAlign(CENTER, CENTER);
            text(t, x * 180 + 100, y * 180 + 100);
        }
    }
}

function draw() {
    display_populations();
    noLoop();
}

/*
 * ---- End of Javascript ----
 */
