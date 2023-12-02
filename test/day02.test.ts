import {expect, describe, it} from "vitest";
import * as day02 from "../src/day02.js";
import {Sequence} from "../src/sequence.js";


describe("Part 1", () => {
    it("Identifies a game that's possible", () => {
        const game = new day02.Game("Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green");
        expect(game.gameId).toBe(1);
        expect(day02.isPossible(game)).toBeTruthy();
    });

    it("Identifies a game that's not possible", () => {
        const game = new day02.Game("Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red");
        expect(game.gameId).toBe(3);
        expect(day02.isPossible(game)).toBeFalsy();
    })

    it("#sumIdsOfPossibleGames", async () => {
        const gameDescriptions = new Sequence([
            "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
            "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
            "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
            "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
            "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green"
        ]);

        expect(await day02.sumIdsOfPossibleGames(gameDescriptions)).toBe(8);
    });
});

describe("Part 2", () => {
    it("Finds min cubes needed", () => {
        const game = new day02.Game("Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green");
        expect(day02.minCubesNeeded(game)).toStrictEqual({ red: 4, green: 2, blue: 6 });
    });

    it("Sums power of games", async () => {
        const gameDescriptions = new Sequence([
            "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
            "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
            "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
            "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
            "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green"
        ]);

        expect(await day02.sumPowerOfGames(gameDescriptions)).toBe(2286);
    })
});