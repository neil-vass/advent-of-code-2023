import {expect, describe, it} from "vitest";
import * as day18 from "../src/day18.js";
import {Sequence} from "../src/sequence.js";

describe("Part 1", () => {
    it("Parses dig steps", () => {
        expect(day18.parseDigStep("R 6 (#70c710)")).toStrictEqual({ dir: "R", distance: 6, colour: "#70c710" });
    });

    it("Gives position after dig steps", () => {
        const start = {x:0, y:0};
        const digStep: day18.DigStep = { dir: "R", distance: 6, colour: "#70c710" };
        expect(day18.positionAfterDigStep(start, digStep)).toStrictEqual({x:0, y:6});
    });

    it("Digs a little hole", async () => {
        const lines = new Sequence([
            "R 1 (#000000)",
            "D 1 (#000000)",
            "L 1 (#000000)",
            "U 1 (#000000)",
        ]);
        const digger = await day18.Digger.buildFromDescription(lines);
        expect(digger.digPlan.length).toBe(4);
        expect(digger.digPlan[0]).toStrictEqual({ dir: "R", distance: 1, colour: "#000000" });
        expect(digger.holeVolume()).toBe(4);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "R 6 (#70c710)",
            "D 5 (#0dc571)",
            "L 2 (#5713f0)",
            "D 2 (#d2c081)",
            "R 2 (#59c680)",
            "D 2 (#411b91)",
            "L 5 (#8ceee2)",
            "U 2 (#caa173)",
            "L 1 (#1b58a2)",
            "U 2 (#caa171)",
            "R 2 (#7807d2)",
            "U 3 (#a77fa3)",
            "L 2 (#015232)",
            "U 2 (#7a21e3)",
        ]);
        const digger = await day18.Digger.buildFromDescription(lines);
        expect(digger.holeVolume()).toBe(62);
    });
});