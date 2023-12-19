import {expect, describe, it} from "vitest";
import * as day19 from "../src/day19.js";
import {Sequence} from "../src/sequence.js";


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

    it("Parses 'straight to label' rules", () => {
        const ruleFn = day19.parseRule("rfg");
        expect(ruleFn({x:1,m:2,a:3,s:4})).toBe("rfg");
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
        const workflow = "in{a>250:A,R}";
        const acceptablePart = "{x=100,m=200,a=300,s=400}";
        const rejectablePart = "{x=2,m=4,a=6,s=8}";

        const system = new day19.System();
        system.addWorkflow(workflow);
        system.process(acceptablePart);
        system.process(rejectablePart);
        expect(system.acceptedTotalRatings()).toBe(1000);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "px{a<2006:qkq,m>2090:A,rfg}",
            "pv{a>1716:R,A}",
            "lnx{m>1548:A,A}",
            "rfg{s<537:gd,x>2440:R,A}",
            "qs{s>3448:A,lnx}",
            "qkq{x<1416:A,crn}",
            "crn{x>2662:A,R}",
            "in{s<1351:px,qqz}",
            "qqz{s>2770:qs,m<1801:hdj,R}",
            "gd{a>3333:R,R}",
            "hdj{m>838:A,pv}",
            "",
            "{x=787,m=2655,a=1222,s=2876}",
            "{x=1679,m=44,a=2067,s=496}",
            "{x=2036,m=264,a=79,s=2244}",
            "{x=2461,m=1339,a=466,s=291}",
            "{x=2127,m=1623,a=2188,s=1013}",
        ]);

        expect(await day19.solvePart1(lines)).toBe(19114);
    });
});