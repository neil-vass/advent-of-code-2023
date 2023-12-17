import {expect, describe, it, beforeEach} from "vitest";
import * as day17 from "../src/day17.js";
import {Crucible, Dir, HeadOfPath} from "../src/day17.js";
import {Sequence} from "../src/sequence.js";


let exampleLines: Sequence<string>;

beforeEach(() => {
    exampleLines = new Sequence([
        "2413432311323",
        "3215453535623",
        "3255245654254",
        "3446585845452",
        "4546657867536",
        "1438598798454",
        "4457876987766",
        "3637877979653",
        "4654967986887",
        "4564679986453",
        "1224686865563",
        "2546548887735",
        "4322674655533",
    ]);
});

describe("Part 1", () => {
    it("Builds route finder", async () => {
        const routeFinder = await day17.RouteFinder.buildFromDescription(exampleLines);
        expect(routeFinder.start).toStrictEqual({x: 0, y: 0});
        expect(routeFinder.goal).toStrictEqual({x: 12, y: 12});
        expect(routeFinder.trafficMap[1][1]).toBe(2);
    });

    it("HeadOfPath offers all options when first starting", () => {
        const headOfPath = new day17.HeadOfPath({x: 0, y: 0});
        expect(headOfPath.costSoFar).toBe(0);
        expect(headOfPath.stepsInSameDirection).toBe(0);
        expect(headOfPath.possibleNextSteps()).toStrictEqual([
                                { pos: {x:-1, y:0}, dir: Dir.Up },
                                { pos: {x:0, y:1}, dir: Dir.Right },
                                { pos: {x:1, y:0}, dir: Dir.Down },
                                { pos: {x:0, y:-1}, dir: Dir.Left },
                                ]);
    });

    it("HeadOfPath doesn't offer reversing", () => {
        const headOfPath = new day17.HeadOfPath({x: 0, y: 1}, 1, Dir.Right, 1);
        expect(headOfPath.possibleNextSteps()).toStrictEqual([
                                { pos: {x: -1, y: 1}, dir: Dir.Up },
                                { pos: {x: 0, y: 2}, dir: Dir.Right },
                                { pos: {x: 1, y: 1}, dir: Dir.Down },
                            ]);
    });

    it("HeadOfPath must change dir after 3 steps", () => {
        const headOfPath = new day17.HeadOfPath({x: 0, y: 1}, 1, Dir.Right, 3);
        expect(headOfPath.possibleNextSteps()).toStrictEqual([
                                { pos: {x: -1, y: 1}, dir: Dir.Up },
                                { pos: {x: 1, y: 1}, dir: Dir.Down },
                            ]);
    });

    it("Offers correct next steps from start", async () => {
        const routeFinder = await day17.RouteFinder.buildFromDescription(exampleLines);
        const startOfPath = new day17.HeadOfPath({x: 0, y: 0});
        const options = routeFinder.neighbours(startOfPath);
        expect(options.length).toBe(2);
        expect(options[0]).toStrictEqual(new HeadOfPath({x: 0, y: 1}, 4, Dir.Right, 1));
    });

    it("Finds best path on tiny grid", async () => {
        const tiny = new Sequence([
            "24",
            "21"
        ]);
        const routeFinder = await day17.RouteFinder.buildFromDescription(tiny);
        expect(routeFinder.heatLossOnBestPath()).toBe(3);
    });

    it("Solves example", async () => {
        expect(await day17.solvePart1(exampleLines)).toBe(102);
    });
});

describe("Part 2", () => {
    it("Takes unfortunate path", async () => {
        const lines = new Sequence([
            "111111111111",
            "999999999991",
            "999999999991",
            "999999999991",
            "999999999991",
        ]);
        const routeFinder = await day17.RouteFinder.buildFromDescription(lines, Crucible.Ultra);
        expect(routeFinder.heatLossOnBestPath()).toBe(71);
    });

    it("Solves example", async () => {
        expect(await day17.solvePart2(exampleLines)).toBe(94);
    });
});