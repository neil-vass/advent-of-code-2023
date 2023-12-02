import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

type CubeCounts = {[key: string]: number; red: number; green: number; blue: number};

export class Game {
    readonly gameId: number;
    readonly allResults = new Array<Array<[number, string]>>();

    constructor(line: string) {
        const [gameLabel, allResultsStr] = line.split(':');
        this.gameId = Number(gameLabel.split(' ')[1]);

        for (const gameResultsStr of allResultsStr.split(';')) {
            const gameResults = Array<[number, string]>();
            for (const countAndColour of gameResultsStr.split(',')) {
                const [count, colour] = countAndColour.trim().split(' ');
                gameResults.push([+count, colour]);
            }
            this.allResults.push(gameResults)
        }
    }
}

export function isPossible(game: Game) {
    const max: CubeCounts = { red: 12, green: 13, blue: 14 };

    for (const gameResults of game.allResults) {
        for (const [count, colour] of gameResults) {
            if (count > max[colour]) return false;
        }
    }

    return true;
}

export async function sumIdsOfPossibleGames(gameDescriptions: Sequence<string>) {
    const possibleGames = gameDescriptions.map(gd => new Game(gd)).filter(g => isPossible(g))
    return Sequence.sum(possibleGames.map(g => g.gameId));
}

export function minCubesNeeded(game: Game) {
    const needed: CubeCounts = { red: 0, green: 0, blue: 0 }

    for (const gameResults of game.allResults) {
        for (const [count, colour] of gameResults) {
            needed[colour] = Math.max(needed[colour], count);
        }
    }
    return needed;
}

export async function sumPowerOfGames(gameDescriptions: Sequence<string>) {
    const minCubes = gameDescriptions.map(gd => new Game(gd)).map(g => minCubesNeeded(g));
    const powers = minCubes.map(c => c.red * c.green * c.blue);
    return Sequence.sum(powers);
}


// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const games = linesFromFile("./data/day02.txt");
    console.log(await sumPowerOfGames(games));
}
