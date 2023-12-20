import {expect, describe, it} from "vitest";
import * as day19pt2 from "../src/day19-part2.js";
import {PartsRange} from "../src/day19-part2.js";
import {Sequence} from "../src/sequence.js";


describe("Range splitting", () => {
    it("PartsRange splits", () => {
        const range = PartsRange.full;
        expect(range.combinations()).toBe(4000 * 4000 * 4000 * 4000);

        const [matched, unmatched] = range.splitGreaterThan("x", 1000);
        expect(matched.combinations()).toBe(3000 * 4000 * 4000 * 4000);
        expect(unmatched.combinations()).toBe(1000 * 4000 * 4000 * 4000);

        const sumOfAllSplits = matched.combinations() + unmatched.combinations();
        expect(sumOfAllSplits).toBe(range.combinations());
    });

    it("Whole range matches split rule", () => {
        const range = PartsRange.full;
        const [matched, unmatched] = range.splitLessThan("m", 5000);
        expect(matched.combinations()).toBe(4000 * 4000 * 4000 * 4000);
        expect(unmatched.combinations()).toBe(0);

        const sumOfAllSplits = matched.combinations() + unmatched.combinations();
        expect(sumOfAllSplits).toBe(range.combinations());
    });

    it("No match for split rule", () => {
        const range = PartsRange.full;
        const [above3000, discarded] = range.splitGreaterThan("a", 3000);
        const [emptyMatch, wholeRangeUnmatched] = above3000.splitLessThan("a", 1000);
        expect(emptyMatch.combinations()).toBe(0);
        expect(wholeRangeUnmatched.combinations()).toBe(4000 * 4000 * 1000 * 4000);

        const sumOfAllSplits =
            discarded.combinations() +
            emptyMatch.combinations() +
            wholeRangeUnmatched.combinations();
        expect(sumOfAllSplits).toBe(range.combinations());
    });
});


describe("Combination counting", () => {
    it("Solves reject-all base case", () => {
        const system = new day19pt2.System();
        system.addWorkflow("in{R}");
        expect(system.countAcceptableCombinations()).toBe(0);
    });

    it("Solves accept-all base case", () => {
        const system = new day19pt2.System();
        system.addWorkflow("in{A}");
        expect(system.countAcceptableCombinations()).toBe(4000 * 4000 * 4000 * 4000);
    });

    it("Filters through multiple workflows", () => {
        const system = new day19pt2.System();
        system.addWorkflow("in{x>100:xy,A}");
        system.addWorkflow("xy{m>100:R,R}");
        expect(system.countAcceptableCombinations()).toBe(100 * 4000 * 4000 * 4000);
    });

    it("Collects multiple accepted ranges from one workflow", () => {
        const system = new day19pt2.System();
        system.addWorkflow("in{x>100:A,A}");
        expect(system.countAcceptableCombinations()).toBe(4000 * 4000 * 4000 * 4000);
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

        expect(await day19pt2.solvePart2(lines)).toBe(167409079868000);
    });
});
