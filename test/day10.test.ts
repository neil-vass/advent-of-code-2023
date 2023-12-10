import {expect, describe, it} from "vitest";
import * as day10 from "../src/day10.js";
import {Sequence} from "../src/sequence.js";


describe("Part 1", () => {
    it("Plumbs tile connections", () => {
        expect(day10.tileConnections("|", 1, 1)).toStrictEqual([{x:0, y:1}, {x:2, y:1}]);
        expect(day10.tileConnections("-", 1, 1)).toStrictEqual([{x:1, y:2}, {x:1, y:0}]);
        expect(day10.tileConnections("L", 1, 1)).toStrictEqual([{x:0, y:1}, {x:1, y:2}]);
        expect(day10.tileConnections("J", 1, 1)).toStrictEqual([{x:0, y:1}, {x:1, y:0}]);
        expect(day10.tileConnections("7", 1, 1)).toStrictEqual([{x:2, y:1}, {x:1, y:0}]);
        expect(day10.tileConnections("F", 1, 1)).toStrictEqual([{x:1, y:2}, {x:2, y:1}]);
        expect(day10.tileConnections(".", 1, 1)).toStrictEqual([]);
        expect(day10.tileConnections("S", 1, 1)).toStrictEqual([{x:0, y:1}, {x:1, y:2}, {x:2, y:1}, {x:1, y:0}]);
    });

    it("Builds grid from description", async () => {
        const lines = new Sequence([
            ".....",
            ".S-7.",
            ".|.|.",
            ".L-J.",
            ".....",
        ]);

        const pipeMap = await day10.PipeMap.buildFromDescription(lines);
        // Implementation detail: we pad the map, so top left here is (1,1).
        expect(pipeMap.start).toStrictEqual({x:2, y:2});

        // From "S" we can go right or down.
        expect(pipeMap.neighbours({x:2, y:2})).toStrictEqual([{x:2, y:3}, {x:3, y:2}]);
        // From "L" we can go up or right.
        expect(pipeMap.neighbours({x:4, y:2})).toStrictEqual([{x:3, y:2}, {x:4, y:3}]);
    });

    it("Solves tiny example", async () => {
        const lines = new Sequence([
            ".....",
            ".S-7.",
            ".|.|.",
            ".L-J.",
            ".....",
        ]);

        expect(await day10.solvePart1(lines)).toBe(4);
    });

    it("Solves more complex example", async () => {
        const lines = new Sequence([
            "7-F7-",
            ".FJ|7",
            "SJLL7",
            "|F--J",
            "LJ.LJ",
        ]);

        expect(await day10.solvePart1(lines)).toBe(8);
    });

});

describe("Part 2", () => {
    it("Solves trivial case ", async () => {
        const lines = new Sequence([
            ".....",
            ".S-7.",
            ".|.|.",
            ".L-J.",
            ".....",
        ]);

        expect(await day10.solvePart2(lines)).toBe(1);
    });

    it("Solves first example", async () => {
        const lines = new Sequence([
            "...........",
            ".S-------7.",
            ".|F-----7|.",
            ".||.....||.",
            ".||.....||.",
            ".|L-7.F-J|.",
            ".|..|.|..|.",
            ".L--J.L--J.",
            "...........",
        ]);

        expect(await day10.solvePart2(lines)).toBe(4);
    });

    it("Solves squeezed example", async () => {
        const lines = new Sequence([
            "..........",
            ".S------7.",
            ".|F----7|.",
            ".||....||.",
            ".||....||.",
            ".|L-7F-J|.",
            ".|..||..|.",
            ".L--JL--J.",
            "..........",
        ]);

        expect(await day10.solvePart2(lines)).toBe(4);
    });

    it("Solves larger example", async () => {
        const lines = new Sequence([
            ".F----7F7F7F7F-7....",
            ".|F--7||||||||FJ....",
            ".||.FJ||||||||L7....",
            "FJL7L7LJLJ||LJ.L-7..",
            "L--J.L7...LJS7F-7L7.",
            "....F-J..F7FJ|L7L7L7",
            "....L7.F7||L7|.L7L7|",
            ".....|FJLJ|FJ|F7|.LJ",
            "....FJL-7.||.||||...",
            "....L---J.LJ.LJLJ...",
        ]);

        expect(await day10.solvePart2(lines)).toBe(8);
    });

    it("Solves last example", async () => {
        const lines = new Sequence([
            "FF7FSF7F7F7F7F7F---7",
            "L|LJ||||||||||||F--J",
            "FL-7LJLJ||||||LJL-77",
            "F--JF--7||LJLJ7F7FJ-",
            "L---JF-JLJ.||-FJLJJ7",
            "|F|F-JF---7F7-L7L|7|",
            "|FFJF7L7F-JF7|JL---7",
            "7-L-JL7||F7|L7F-7F7|",
            "L.L7LFJ|||||FJL7||LJ",
            "L7JLJL-JLJLJL--JLJ.L",
        ]);

        expect(await day10.solvePart2(lines)).toBe(10);
    });
});