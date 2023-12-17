import {expect, describe, it} from "vitest";
import * as day16 from "../src/day16.js";
import {Dir} from "../src/day16.js";
import {Sequence} from "../src/sequence.js";
import {linesFromFile} from "../src/helpers.js";

describe("Part 1", () => {
    it("Finds exit directions for empty tiles", async () => {
        expect(day16.exitDirections(Dir.Up, ".")).toStrictEqual([Dir.Up]);
        expect(day16.exitDirections(Dir.Right, ".")).toStrictEqual([Dir.Right]);
        expect(day16.exitDirections(Dir.Down, ".")).toStrictEqual([Dir.Down]);
        expect(day16.exitDirections(Dir.Left, ".")).toStrictEqual([Dir.Left]);
    });

    it("Finds reflection directions for backslash mirrors", async () => {
        expect(day16.exitDirections(Dir.Up, "\\")).toStrictEqual([Dir.Left]);
        expect(day16.exitDirections(Dir.Right, "\\")).toStrictEqual([Dir.Down]);
        expect(day16.exitDirections(Dir.Down, "\\")).toStrictEqual([Dir.Right]);
        expect(day16.exitDirections(Dir.Left, "\\")).toStrictEqual([Dir.Up]);
    });

    it("Finds reflection directions for forward slash mirrors", async () => {
        expect(day16.exitDirections(Dir.Up, "/")).toStrictEqual([Dir.Right]);
        expect(day16.exitDirections(Dir.Right, "/")).toStrictEqual([Dir.Up]);
        expect(day16.exitDirections(Dir.Down, "/")).toStrictEqual([Dir.Left]);
        expect(day16.exitDirections(Dir.Left, "/")).toStrictEqual([Dir.Down]);
    });

    it("Finds reflection directions for vertical splitters", async () => {
        expect(day16.exitDirections(Dir.Up, "|")).toStrictEqual([Dir.Up]);
        expect(day16.exitDirections(Dir.Right, "|")).toStrictEqual([Dir.Up, Dir.Down]);
        expect(day16.exitDirections(Dir.Down, "|")).toStrictEqual([Dir.Down]);
        expect(day16.exitDirections(Dir.Left, "|")).toStrictEqual([Dir.Up, Dir.Down]);
    });

    it("Finds reflection directions for horizontal splitters", async () => {
        expect(day16.exitDirections(Dir.Up, "-")).toStrictEqual([Dir.Left, Dir.Right]);
        expect(day16.exitDirections(Dir.Right, "-")).toStrictEqual([Dir.Right]);
        expect(day16.exitDirections(Dir.Down, "-")).toStrictEqual([Dir.Left, Dir.Right]);
        expect(day16.exitDirections(Dir.Left, "-")).toStrictEqual([Dir.Left]);
    });

    it("Builds contraption", async () => {
        const lines = linesFromFile("./test/data/day16-example.txt")
        const contraption = await day16.Contraption.buildFromDescription(lines);
        const beamStart = {x:0, y:0};
        expect(contraption.countEnergizedTiles(beamStart, Dir.Right)).toBe(46);
    });
});

describe("Part 2", () => {
    it("Solves example", async () => {
        const lines = linesFromFile("./test/data/day16-example.txt")
        expect(await day16.solvePart2(lines)).toBe(51);
    });
});