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
var MAX_FOOD = 2 ** 30;
var MUTATION = 2 ** 10;

var population = new Array(MAX_SPECIES);

/* A function to initialise the first population */

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

/* Compute the Maximum Level */
var MAX_LEVEL = level(MAX_SPECIES - 1);

function prey(x, y) {
    if (level(x) == level(y) + 1) {
        if ((x & y) == y) {
            return true;
        }
    }
    return false;
}

/* flip a random bit */
function mutate(p) {
    return p ^ (1 << int(random(4)));
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

function replicate_mutate_predate (p) {
    var fed = new Array(MAX_SPECIES);

    for (i = 0; i < MAX_SPECIES; i++) {
        p[i] *= 2;
        if (p[i] > MUTATION) {
            m = mutate(i);
            p[i]--;
            p[m]++;
        }
        fed[i] = 0;
    }

    for (l = 1; l <= MAX_LEVEL; l++) {
        var pred_total = 0;
        var prey_total = 0;
        for (i = 0; i < MAX_SPECIES; i++) {
            if (level(i) == l) {
                if (p[i] > 0) {
                    pred_total += p[i];
                    console.log("Level: " + l + " - Pred: " + i + " - Pred Pop: " + p[i] + " - Pred Total: " + pred_total );
                }
            }
            if (level(i) == (l - 1)) {
                if (p[i] > 0) {
                    prey_total += p[i];
                    console.log("Level: " + l + " - Prey: " + i + " - Prey Pop: " + p[i] + " - Prey Total: " + prey_total );
                }
            }
        }
        console.log("Level: " + l + " - Pred: " + pred_total + " - Prey: " + prey_total);
        if (prey_total < 0) { noLoop(); }
        if (pred_total < 1) { continue; }

        var consumption_ratio = Math.min(1, prey_total / float(pred_total));
        console.log("Consupmtion Ratio: " + consumption_ratio);

        for (i = 0; i < MAX_SPECIES; i++) {
            if (level(i) == l && p[i] > 0) {
                for (j = 0; j < MAX_SPECIES; j++) {
                    if (prey(i, j)) {
                        console.log("Pred: " + i + " - Prey: " + j );
                        console.log("   -> Prey Pop: " + p[i] + " - Prey Fed: " + fed[i] + " - Prey Pop: " + p[j]);
                        var eaten = int(p[i] * consumption_ratio * p[j] / prey_total + 0.0001);
                        fed[i] += eaten;
                        p[j] -= eaten;
                        console.log("   +> Prey Pop: " + p[i] + " - Prey Fed: " + fed[i] + " - Prey Pop: " + p[j] + " ==> Eaten: " + eaten);
                    }
                }
            }
        }

    }

    console.log("Food: " + p[0]);
    p[0] = Math.max(Math.min(p[0], MAX_FOOD), 1);
    for (i = 1; i < MAX_SPECIES; i++) {
        p[i] = Math.max(Math.min(p[i], fed[i]), 0);
    }
}

/* The plotting functions */

function setup() {
    createCanvas(740, 740);
    background(51);

    frameRate(1);
    
    initialise_population(population);
}

function draw() {
    display_populations();

    replicate_mutate_predate(population);

    // noLoop();
    // if (frameCount > 120) { noLoop(); }

}

/*
 * ---- End of Javascript ----
 */
