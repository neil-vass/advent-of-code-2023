import {expect, describe, it} from "vitest";
import {Sequence} from "../src/sequence.js";


describe("#map", () => {
    it("Maps over an array", async () => {
        const nums = new Sequence([1, 2, 3]);
        const doubles = nums.map(x => x * 2);
        const results = await doubles.toArray();
        expect(results).toStrictEqual([2,4,6])
    });
});

describe("#filter", () => {
    it("Discards items that don't match condition", async () => {
        const nums = new Sequence([1, 2, 3, 4, 5, 6]);
        const evens = nums.filter(x => x % 2 === 0);

        const results = await evens.toArray();
        expect(results).toStrictEqual([2, 4, 6]);
    })
});


describe("#reduce", () => {
    it("Throws if no initial value and empty sequence", async () => {
        const empty = new Sequence([]);
        expect(async () => await empty.reduce((acc, val) => acc + val)).rejects.toThrow();
    });

    it("Returns initial value for empty sequence", async () => {
        const empty = new Sequence([]);
        expect(await empty.reduce((acc, val) => acc + val, 0)).toBe(0);
    });

    it("Reduces sequence using given function", async () => {
        const empty = new Sequence([1, 2, 3]);
        expect(await empty.reduce((acc, val) => acc + val, 0)).toBe(6);
    });

    it("Uses first item in sequence when no initial value is given", async () => {
        const empty = new Sequence([1, 2, 3]);
        expect(await empty.reduce((acc: number, val) => acc + val)).toBe(6);
    });

    it("Uses initial value to start the accumulator", async () => {
        const empty = new Sequence([1, 2, 3]);
        expect(await empty.reduce((acc, val) => acc.concat(` *${val}*`), "list:"))
            .toBe("list: *1* *2* *3*");
    });

    it("When output type is different than the ", async () => {
        const empty = new Sequence([1, 2, 3]);
        expect(await empty.reduce((acc, val) => acc.concat(` *${val}*`), ""))
            .toBe(" *1* *2* *3*");
    });
});

describe("#sum", () => {
    it("Sums array", async () => {
        const nums = new Sequence([1, 2, 3]);
        const total = await Sequence.sum(nums);
        expect(total).toBe(6);
    });

    it("Sum of empty sequence is 0", async () => {
        const nums = new Sequence([]);
        const total = await Sequence.sum(nums);
        expect(total).toBe(0);
    });
});


describe("#max", () => {
    it("Finds max of numbers sequence", async () => {
        const nums = new Sequence([0, 2, 9, 3, 5]);
        const largest = await Sequence.max(nums);
        expect(largest).toBe(9);
    });

    it("Throws on empty sequence", async () => {
        const nums = new Sequence([]);
        expect(async () => await Sequence.max(nums)).rejects.toThrow(/empty sequence/);
    });
});

describe("#maxObject", () => {
    it("Finds max object, as defined by a 'key' property", async () => {
        const items = new Sequence([
            { name: "Apple", size: 2 }, { name: "Banana", size: 5 }, { name: "Cherry", size: 1 }
        ]);

        const largest = await Sequence.maxObject(items, "size");
        expect(largest).toStrictEqual({ name: "Banana", size: 5 });
    });

    it("Throws on empty sequence", async () => {
        const items = new Sequence([]);
        expect(async () => await Sequence.maxObject(items, "None"))
            .rejects.toThrow(/empty sequence/);
    });

    it("Throws if 'key' property doesn't exist", async () => {
        const items = new Sequence([
            { name: "Apple", size: 2 }, { name: "Banana", size: 5 }, { name: "Cherry", size: 1 }
        ]);

        expect(async () => await Sequence.maxObject(items, "age"))
            .rejects.toThrow(/Key property/);
    });

    it("Throws if 'key' property isn't a number", async () => {
        // We could expand the functionality in future to allow strings or other comparable types.
        const items = new Sequence([
            { name: "Apple", size: 2 }, { name: "Banana", size: "medium" }, { name: "Cherry", size: 1 }
        ]);

        expect(async () => await Sequence.maxObject(items, "size"))
            .rejects.toThrow(/Key property/);
    });
});

describe("#minObject", () => {
    it("Finds min object, as defined by a 'key' property", async () => {
        const items = new Sequence([
            { name: "Apple", size: 2 }, { name: "Banana", size: 5 }, { name: "Cherry", size: 1 }
        ]);

        const smallest = await Sequence.minObject(items, "size");
        expect(smallest).toStrictEqual({ name: "Cherry", size: 1 });
    });
});

describe("#count", () => {
    it("Counts any type of sequence", async () => {
        const seq = new Sequence(["a", "b", "c", "d"]);
        expect(await Sequence.count(seq)).toBe(4);
    });

    it("Count of empty sequence is zero", async () => {
        const empty = new Sequence([]);
        expect(await Sequence.count(empty)).toBe(0);
    });
});

describe("Multiple operations can be chained", () => {
    it("Filter, map to new values, and sum total", async () => {
        const nums = new Sequence([10, -5, 10, 20, -10]);
        const positivesDoubled = nums.filter(n => n > 0).map(n => n * 2);
        const total = await Sequence.sum(positivesDoubled);
        expect(total).toBe(80);
    });
});