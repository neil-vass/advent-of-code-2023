import {expect, describe, it} from "vitest";
import * as day08 from "../src/day08.js";
import {Sequence} from "../src/sequence.js";

describe("Part 1", () => {
    it("Loops instructions", () => {
        const instructions = day08.generateInstructions("RL");
        expect(instructions.next().value).toBe(1);
        expect(instructions.next().value).toBe(0);
        expect(instructions.next().value).toBe(1);
        expect(instructions.next().value).toBe(0);
        expect(instructions.next().value).toBe(1);
    });

    it("Follows instructions", async () => {
        const lines = new Sequence([
            "LLR",
            "",
            "AAA = (BBB, BBB)",
            "BBB = (AAA, ZZZ)",
            "ZZZ = (ZZZ, ZZZ)"
        ]);
        const navigator = await day08.parseInput(lines);
        expect(navigator.stepsBetween("AAA", "ZZZ")).toBe(6);
    });
});

describe("Part 2", () => {
    it("Follows instructions", async () => {
        const lines = new Sequence([
            "LR",
            "",
            "11A = (11B, XXX)",
            "11B = (XXX, 11Z)",
            "11Z = (11B, XXX)",
            "22A = (22B, XXX)",
            "22B = (22C, 22C)",
            "22C = (22Z, 22Z)",
            "22Z = (22B, 22B)",
            "XXX = (XXX, XXX)"
        ]);
        const navigator = await day08.parseInput(lines);
        expect(navigator.parallelStepsBetween("A", "Z")).toBe(6);
    });
});