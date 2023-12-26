import {expect, describe, it, beforeEach} from "vitest";
import * as day25 from "../src/day25.js";
import {Sequence} from "../src/sequence.js";
import {choose} from "../src/day25.js";

let exampleLines: Sequence<string>;
beforeEach(() => {
    exampleLines = new Sequence([
        "jqt: rhn xhk nvd",
        "rsh: frs pzl lsr",
        "xhk: hfx",
        "cmg: qnr nvd lhk bvb",
        "rhn: xhk bvb hfx",
        "bvb: xhk hfx",
        "pzl: lsr hfx nvd",
        "qnr: nvd",
        "ntq: jqt hfx bvb xhk",
        "nvd: lhk",
        "lsr: lhk",
        "rzs: qnr cmg lsr rsh",
        "frs: qnr lhk lsr",
    ]);
});

describe("Part 1", () => {
    it("Parses input lines", async () => {
        expect(day25.parseComponentConnections("jqt: rhn xhk nvd")).toStrictEqual(["jqt", new Set(["rhn", "xhk", "nvd"])]);
    });

    it("Chooses a random item from collection", () => {
        const numTrials = 10000;
        const collection = [1, 2];
        const minCountForEachOption = 450; // If we get fewer than this, it's likely there's something wrong.

        const results = Array.from({length:numTrials}, () => choose(collection));
        const ones = results.filter(r => r === 1).length;
        const twos = results.filter(r => r === 2).length;

        expect(ones + twos).toBe(numTrials);
        expect(ones).toBeGreaterThan(minCountForEachOption);
        expect(twos).toBeGreaterThan(minCountForEachOption);
    });

    it("Choosing from empty collection gives undefined", () => {
        expect(day25.choose([])).toBeUndefined();
    });

    it("Finds size of initial connected groups (whole graph)", async () => {
        const apparatus = await day25.Apparatus.buildFromDescription(exampleLines);
        expect(apparatus.connectedGroupSizes()).toStrictEqual([15]);
    });

    it("Finds sizes of connected groups after removing key wires", async () => {
        const apparatus = await day25.Apparatus.buildFromDescription(exampleLines);
        apparatus.cutWire("hfx", "pzl");
        apparatus.cutWire("bvb", "cmg");
        apparatus.cutWire("nvd", "jqt");
        expect(apparatus.connectedGroupSizes()).toStrictEqual([6, 9]);
    });

    it("Identifies which wires to cut to make 2 separate groups", async () => {
        const apparatus = await day25.Apparatus.buildFromDescription(exampleLines);
        expect(apparatus.cutsToCauseDisconnect()).toStrictEqual([["hfx", "pzl"], ["bvb", "cmg"], ["nvd", "jqt"]]);
        expect(apparatus.connectedGroupSizes()).toStrictEqual([6, 9]);
    });
});