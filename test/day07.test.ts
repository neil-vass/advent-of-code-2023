import {expect, describe, it} from "vitest";
import * as day07 from "../src/day07.js";
import {Sequence} from "../src/sequence.js";
import {getHandType, HandType} from "../src/day07.js";

describe("Part 1", () => {

    it("Finds hand type", () => {
        expect(day07.getHandType("32T3K")).toBe(HandType.Pair);
        expect(day07.getHandType("T55J5")).toBe(HandType.ThreeOfAKind);
        expect(day07.getHandType("KK677")).toBe(HandType.TwoPair);
        expect(day07.getHandType("KTJJT")).toBe(HandType.TwoPair);
        expect(day07.getHandType("QQQJA")).toBe(HandType.ThreeOfAKind);
    });

    it("Scores hands", () => {
        expect(day07.scoreHand("32T3K", getHandType("32T3K"))).toBe(10201090212);
    });


    it("Solves example", async () => {
        const handsAndBids = new Sequence([
            "32T3K 765",
            "T55J5 684",
            "KK677 28",
            "KTJJT 220",
            "QQQJA 483"
        ]);
        expect(await day07.solvePart1(handsAndBids)).toBe(6440);
    });
});

describe("Part 2", async () => {
    it("Finds hand type", () => {
        expect(day07.getHandTypeWithJokers("32T3K")).toBe(HandType.Pair);
        expect(day07.getHandTypeWithJokers("T55J5")).toBe(HandType.FourOfAKind);
        expect(day07.getHandTypeWithJokers("KK677")).toBe(HandType.TwoPair);
        expect(day07.getHandTypeWithJokers("KTJJT")).toBe(HandType.FourOfAKind);
        expect(day07.getHandTypeWithJokers("QQQJA")).toBe(HandType.FourOfAKind);
    });

    it("Solves example", async () => {
        const handsAndBids = new Sequence([
            "32T3K 765",
            "T55J5 684",
            "KK677 28",
            "KTJJT 220",
            "QQQJA 483"
        ]);
        expect(await day07.solvePart2(handsAndBids)).toBe(5905);
    });
});