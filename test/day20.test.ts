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
        expect(system.pushTheButton()).toBe(8 * 4);
    });
});