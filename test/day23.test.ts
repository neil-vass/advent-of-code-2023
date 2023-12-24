import {expect, describe, it, beforeEach} from "vitest";
import * as day23 from "../src/day23.js";
import {Sequence} from "../src/sequence.js";

let exampleLines: Sequence<string>;
beforeEach(() => {
    exampleLines = new Sequence([
        "#.#####################",
        "#.......#########...###",
        "#######.#########.#.###",
        "###.....#.>.>.###.#.###",
        "###v#####.#v#.###.#.###",
        "###.>...#.#.#.....#...#",
        "###v###.#.#.#########.#",
        "###...#.#.#.......#...#",
        "#####.#.#.#######.#.###",
        "#.....#.#.#.......#...#",
        "#.#####.#.#.#########v#",
        "#.#...#...#...###...>.#",
        "#.#.#v#######v###.###v#",
        "#...#.>.#...>.>.#.###.#",
        "#####v#.#.###v#.#.###.#",
        "#.....#...#...#.#.#...#",
        "#.#########.###.#.#.###",
        "#...###...#...#...#.###",
        "###.###.#.###v#####v###",
        "#...#...#.#.>.>.#.>.###",
        "#.###.###.#.###.#.#v###",
        "#.....###...###...#...#",
        "#####################.#",
    ]);
});

describe("Part 1", () => {
    it("Turns a simple graph into a directed acyclic graph", async () => {
        const lines = new Sequence([
            "#.######",
            "#......#",
            "#.####.#",
            "#.#....#",
            "#...##.#",
            "######.#",
        ]);
        const hikingMap = await day23.HikingMap.buildFromDescription(lines);
        console.log(hikingMap.digraph);

        const expectedGraph = new Map([
            ["start", [{ destination: "1,1", cost: 1 }]],
            ["5,6", []],
            ["1,1", [{ destination: "3,6", cost: 7 }, { destination: "3,6", cost: 9 }]],
            ["3,6", [{ destination: "5,6", cost: 2 }, { destination: "1,1", cost: 9 }, { destination: "1,1", cost: 7 }]]
        ]);

        expect(hikingMap.digraph).toStrictEqual(expectedGraph);
    });

    it("Solves tiny graph", async () => {
        const lines = new Sequence([
            "#.######",
            "#......#",
            "#.####.#",
            "#.#....#",
            "#...##.#",
            "######.#",
        ]);
        const hikingMap = await day23.HikingMap.buildFromDescription(lines);
        expect(hikingMap.longestHike()).toBe(12);
    });

    it("Solves example", async () => {
        const hikingMap = await day23.HikingMap.buildFromDescription(exampleLines);
        console.log(hikingMap.digraph)
        expect(hikingMap.longestHike()).toBe(94);
    });
});

describe("Part 2", () => {
    it("Solves example", async () => {
        const hikingMap = await day23.HikingMap.buildFromDescription(exampleLines, false);
        expect(hikingMap.longestHike()).toBe(154);
    });
});