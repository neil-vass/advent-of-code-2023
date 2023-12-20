import {expect, describe, it} from "vitest";
import * as day20 from "../src/day20.js";
import {Sequence} from "../src/sequence.js";

describe("Part 1", () => {
    it("Builds system", async () => {
        const lines = new Sequence([
            "broadcaster -> a, b, c",
            "%a -> b",
            "%b -> c",
            "%c -> inv",
            "&inv -> a",
        ]);
        const system = await day20.System.buildFromDescription(lines);
        expect(system.pushTheButton()).toStrictEqual({lowCount: 8, highCount: 4});
    });

    it("Solves first example", async () => {
        const lines = new Sequence([
            "broadcaster -> a, b, c",
            "%a -> b",
            "%b -> c",
            "%c -> inv",
            "&inv -> a",
        ]);
        expect(await day20.solvePart1(lines)).toBe(32000000);
    });

    it("Presses second example individual times", async () => {
        const lines = new Sequence([
            "broadcaster -> a",
            "%a -> inv, con",
            "&inv -> b",
            "%b -> con",
            "&con -> output",
        ]);
        const system = await day20.System.buildFromDescription(lines);
        expect(system.pushTheButton(true)).toStrictEqual({lowCount: 4, highCount: 4});
    });

    it("Solves second example", async () => {
        const lines = new Sequence([
            "broadcaster -> a",
            "%a -> inv, con",
            "&inv -> b",
            "%b -> con",
            "&con -> output",
        ]);
        expect(await day20.solvePart1(lines)).toBe(11687500);
    });
});