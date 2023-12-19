import {expect, describe, it} from "vitest";
import * as day19 from "../src/day19.js";


describe("Part 1", () => {
    it("Parses parts", () => {
        expect(day19.parsePart("{x=100,m=200,a=300,s=400}")).toStrictEqual({x:100,m:200,a:300,s:400});
    });

    it("Parses 'accept all' rules", () => {
        const ruleFn = day19.parseRule("A");
        expect(ruleFn({x:1,m:2,a:3,s:4})).toBe(day19.ACCEPT);
    });

    it("Parses 'reject all' rules", () => {
        const ruleFn = day19.parseRule("R");
        expect(ruleFn({x:1,m:2,a:3,s:4})).toBe(day19.REJECT);
    });

    it("Parses 'test and send to label' rules", () => {
        const ruleFn = day19.parseRule("x>10:one");
        expect(ruleFn({x:20,m:2,a:3,s:4})).toBe("one");
        expect(ruleFn({x:1,m:2,a:3,s:4})).toBe(day19.PASS);
    });

    it("Parses 'test and reject' rules", () => {
        const ruleFn = day19.parseRule("a<30:R");
        expect(ruleFn({x:0,m:0,a:3,s:0})).toBe(day19.REJECT);
        expect(ruleFn({x:0,m:0,a:50,s:0})).toBe(day19.PASS);
    });

    it("Parses workflow", () => {
        const workflow = day19.parseWorkflow("pv{a>1716:R,A}");
        expect(workflow.process({x:2,m:4,a:3000,s:8})).toBe(day19.REJECT);
        expect(workflow.process({x:2,m:4,a:6,s:8})).toBe(day19.ACCEPT);
    });

    it("Builds and runs simple system", () => {
        const workflow = "xy{a>250:R,A}";
        const acceptablePart = "{x=100,m=200,a=300,s=400}";
        const rejectablePart = "{x=2,m=4,a=6,s=8}";

        const system = new day19.System();
        system.addWorkflow(workflow);
        system.process(acceptablePart);
        system.process(rejectablePart);
        expect(system.acceptedTotalRatings()).toBe(1000);
    });
});