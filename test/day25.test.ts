import {expect, describe, it, beforeEach} from "vitest";
import * as day25 from "../src/day25.js";
import {Sequence} from "../src/sequence.js";
import seedrandom from "seedrandom";

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

describe("Functionality with simple examples", () => {
    it("Parses input lines", async () => {
        expect(day25.parseComponentConnections("jqt: rhn xhk nvd")).toStrictEqual(["jqt", ["rhn", "xhk", "nvd"]]);
    });

    it("Chooses a random item from collection", () => {
        const numTrials = 10000;
        const collection = [1, 2];
        const minCountForEachOption = 450; // If we get fewer than this, it's likely there's something wrong.

        const results = Array.from({length: numTrials}, () => day25.choose(collection));
        const ones = results.filter(r => r === 1).length;
        const twos = results.filter(r => r === 2).length;

        expect(ones + twos).toBe(numTrials);
        expect(ones).toBeGreaterThan(minCountForEachOption);
        expect(twos).toBeGreaterThan(minCountForEachOption);
    });

    it("Can seed random number generator to get the same series repeatably", () => {
        const collection = [1, 2];
        const generator = seedrandom("String for seed to get same series");
        const results = Array.from({length: 10}, () => day25.choose(collection, generator));
        expect(results).toStrictEqual([2, 2, 2, 1, 2, 1, 2, 1, 2, 1]);
    });

    it("Choosing from empty collection gives undefined", () => {
        expect(day25.choose([])).toBeUndefined();
    });

    it("Inserts missing backlinks", async () => {
        // Used internally, exposed so we can confirm it's working here.
        const lines = new Sequence([
            "aaa: bbb ccc",
            "bbb: aaa",
            "ddd: aaa",
        ]);
        const apparatus = await day25.Apparatus.buildFromDescription(lines);
        expect(apparatus.graph.get("aaa")).toStrictEqual(["bbb", "ccc", "ddd"]);
        expect(apparatus.graph.get("ccc")).toStrictEqual(["aaa"]);
        expect(apparatus.graph.size).toBe(4);
    });

    it("Makes a deep copy of its own graph", async () => {
        // Used internally, exposed so we can confirm it's working here.
        const lines = new Sequence([
            "aaa: bbb ccc",
            "bbb: aaa",
            "ccc: aaa",
        ]);
        const apparatus = await day25.Apparatus.buildFromDescription(lines);
        const copiedGraph = apparatus.copyGraph();
        expect(copiedGraph.get("aaa")).toStrictEqual(["bbb", "ccc"]);

        copiedGraph.get("aaa")!.push("ddd");
        expect(copiedGraph.get("aaa")).toStrictEqual(["bbb", "ccc", "ddd"]);
        expect(apparatus.graph.get("aaa")).toStrictEqual(["bbb", "ccc"]);
    });

    it("Cuts graph into two", async () => {
        const lines = new Sequence([
            "a: b c e",
            "b: a c d",
            "d: b c e",
            "e: a d",
        ]);
        const apparatus = await day25.Apparatus.buildFromDescription(lines);

        const monteCarloIterations = 3;
        const randomNumberGenerator = seedrandom("String for seed to get same series");
        expect(apparatus.groupSizesAfterMinCut(monteCarloIterations, randomNumberGenerator)).toStrictEqual([1, 4]);
    });
});

describe("Solves example graph from Wikipedia", () => {
    // We're using Karger's algorithm: https://en.wikipedia.org/wiki/Karger%27s_algorithm
    // The example graph from there is helpful for visualising how this works.
    // https://en.wikipedia.org/wiki/Karger%27s_algorithm#/media/File:Single_run_of_Karger%E2%80%99s_Mincut_algorithm.svg
    let twoPentagonsLightlyConnected: day25.Apparatus;
    beforeEach(async () => {
        const lines = new Sequence([
            "a: b c d e x",
            "b: a c d e y",
            "c: a b d e z",
            "d: a b c e",
            "e: a b c d",
            "v: w x y z",
            "w: v x y z",
            "x: v w y z a",
            "y: v w x z b",
            "z: v w x y z",
        ]);
        twoPentagonsLightlyConnected = await day25.Apparatus.buildFromDescription(lines);
    })

    it("Separates when we cut correct 3 wires", () => {
        expect(twoPentagonsLightlyConnected.connectedGroupSizes()).toStrictEqual([10]);
        twoPentagonsLightlyConnected.cutWire("a", "x");
        twoPentagonsLightlyConnected.cutWire("b", "y");
        twoPentagonsLightlyConnected.cutWire("c", "z");
        expect(twoPentagonsLightlyConnected.connectedGroupSizes()).toStrictEqual([5, 5]);
    });

    it("Identifies which wires to cut", () => {
        expect(twoPentagonsLightlyConnected.groupSizesAfterMinCut(2)).toStrictEqual([5, 5]);
    });
});


describe("Solves part 1 example", () => {
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
        expect(apparatus.groupSizesAfterMinCut()).toStrictEqual([["hfx", "pzl"], ["bvb", "cmg"], ["nvd", "jqt"]]);
        expect(apparatus.connectedGroupSizes()).toStrictEqual([6, 9]);
    });
});