import {expect, describe, it} from "vitest";
import * as day15 from "../src/day15.js";

describe("Part 1", () => {
    it("Hashes HASH", () => {
        expect(day15.hash("HASH")).toBe(52);
    });

    it("Solves example", async () => {
        const s = "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7";
        expect(day15.solvePart1(s)).toBe(1320);
    });
});

describe("Part 2", () => {
    it("Parses instruction", () => {
        expect(day15.parseInstruction("rn=1")).toStrictEqual({label: "rn", op: "=", focal: 1});
    });

    it("Executes instructions", () => {
        const tunnel = new day15.Tunnel();
        tunnel.execute("rn=1");
        expect(tunnel.contents()).toStrictEqual(["Box 0: [rn 1]"]);

        tunnel.execute("cm-");
        expect(tunnel.contents()).toStrictEqual(["Box 0: [rn 1]"]);

        tunnel.execute("qp=3");
        expect(tunnel.contents()).toStrictEqual(["Box 0: [rn 1]", "Box 1: [qp 3]"]);
    });

    it("Calculates focusing power", () => {
        const s = "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7";
        expect(day15.solvePart2(s)).toBe(145);
    });

});