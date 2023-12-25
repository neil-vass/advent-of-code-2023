import {expect, describe, it, beforeEach} from "vitest";
import * as day25 from "../src/day25.js";
import {Sequence} from "../src/sequence.js";

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
});