import {expect, describe, it} from "vitest";
import * as day22 from "../src/day22.js";
import {Sequence} from "../src/sequence.js";

describe("Part 1", () => {
    it("Understands what space bricks occupy", () => {
        const brick = day22.Brick.buildFromDescription("1,0,1~1,2,1");
        expect(brick.from).toStrictEqual({x:1, y:0, z:1});
        expect(brick.to).toStrictEqual({x:1, y:2, z:1});
        expect(brick.xyPositions()).toStrictEqual(["(1,0)","(1,1)","(1,2)"]);
        expect(brick.zHeightOfBase()).toBe(1);
        expect(brick.zHeightOfTop()).toBe(1);
    });

    it("Stacks 1 brick", async () => {
        const lines = new Sequence([
            "1,0,1~1,2,1"
        ]);
        const stack = await day22.Stack.buildFromDescription(lines);
        expect([...stack.topBricks.keys()]).toStrictEqual(["(1,0)","(1,1)","(1,2)"]);
    });

    it("In a 1-brick stack, it's safe to disintegrate that brick", async () => {
        const lines = new Sequence([
            "1,0,1~1,2,1"
        ]);
        const stack = await day22.Stack.buildFromDescription(lines);
        expect(stack.safeDisintegrationCount()).toBe(1);
    });

    it("Stacks 2 bricks, one holds up the other", async () => {
        const lines = new Sequence([
            "1,0,1~1,2,1",
            "0,0,2~2,0,2",
        ]);
        const stack = await day22.Stack.buildFromDescription(lines);
        expect([...stack.topBricks.keys()]).toStrictEqual([
            "(1,0)","(1,1)","(1,2)","(0,0)","(2,0)"]);

        const [brickA, brickB] = stack.bricks;
        expect(brickA.zHeightOfTop()).toBe(1);
        expect(brickA.restingOn.size).toBe(0);
        expect(brickA.supporting.size).toBe(1);

        expect(brickB.zHeightOfBase()).toBe(2);
        expect(brickB.zHeightOfTop()).toBe(2);


        expect(stack.safeDisintegrationCount()).toBe(1);
    });

    it("Stacks whole example", async () => {
        const lines = new Sequence([
            "1,0,1~1,2,1",
            "0,0,2~2,0,2",
            "0,2,3~2,2,3",
            "0,0,4~0,2,4",
            "2,0,5~2,2,5",
            "0,1,6~2,1,6",
            "1,1,8~1,1,9",
        ]);
        const stack = await day22.Stack.buildFromDescription(lines);
        expect(stack.bricks.at(-1)!.zHeightOfTop()).toBe(6);
        expect(stack.safeDisintegrationCount()).toBe(5);
    });

    it("Listing same bricks in different order gives same stack", async () => {
        // Given example has bricks ordered by distance from ground; here
        // they're rearranged so some closer-to-ground bricks are listed later.
        const lines = new Sequence([
            "0,2,3~2,2,3",
            "2,0,5~2,2,5",
            "0,1,6~2,1,6",
            "1,1,8~1,1,9",
            "1,0,1~1,2,1",
            "0,0,2~2,0,2",
            "0,0,4~0,2,4",
        ]);
        const stack = await day22.Stack.buildFromDescription(lines);
        expect(stack.bricks.at(-1)!.zHeightOfTop()).toBe(6);
        expect(stack.safeDisintegrationCount()).toBe(5);
    });
});

describe("Part 2", () => {
    it("Solves simple case", async () => {
        const lines = new Sequence([
            "1,0,1~1,2,1",
            "0,0,2~2,0,2",
        ]);
        const stack = await day22.Stack.buildFromDescription(lines);
        const brickA = stack.bricks.at(0)!

        expect(stack.numBricksThatWouldFallIfDisintegrated(brickA)).toBe(1);
    });

    it("Finds answers from example", async () => {
        const lines = new Sequence([
            "1,0,1~1,2,1",
            "0,0,2~2,0,2",
            "0,2,3~2,2,3",
            "0,0,4~0,2,4",
            "2,0,5~2,2,5",
            "0,1,6~2,1,6",
            "1,1,8~1,1,9",
        ]);
        const stack = await day22.Stack.buildFromDescription(lines);
        const brickA = stack.bricks.at(0)!
        const brickF = stack.bricks.at(-2)!

        expect(stack.numBricksThatWouldFallIfDisintegrated(brickA)).toBe(6);
        expect(stack.numBricksThatWouldFallIfDisintegrated(brickF)).toBe(1);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "1,0,1~1,2,1",
            "0,0,2~2,0,2",
            "0,2,3~2,2,3",
            "0,0,4~0,2,4",
            "2,0,5~2,2,5",
            "0,1,6~2,1,6",
            "1,1,8~1,1,9",
        ]);
        expect(await day22.solvePart2(lines)).toBe(7);
    });
});