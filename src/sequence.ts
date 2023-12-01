
// A sequence is anything we can keep asking for more T's from.
// Might be an array (or anything using the Iterable interface),
// a generator, and it might be async (e.g. keep requesting the next
// line from a file or other IO-bound operation we want to await).
//
// Users of this type should assume it's async. If it's an array
// or other simple type it will return immediately, but it's safe
// to await its values anyway.
//
// This kind of support is likely to be part of the language soon!
// https://github.com/tc39/proposal-iterator-helpers
// https://github.com/tc39/proposal-async-iterator-helpers
// Until it's available, I've written this helper module.

export class Sequence<T> {
    constructor(protected readonly seq: Iterable<T> | AsyncIterable<T>) {}

    async *[Symbol.asyncIterator]() : AsyncGenerator<T, void, void> {
        for await(const x  of this.seq) {
            yield x;
        }
    }

    // Convenience method, to run through a whole sequence and collect it
    // into an array. Only use this if you know the sequence is finite and
    // its contents will fit into memory.
    async toArray() {
        let results: T[] = [];
        for await (const x of this.seq) {
            results.push(x);
        }
        return results;
    }

    filter(filterCondition: (x: T) => boolean) : Sequence<T> {
        async function* apply_filter(inputSeq: Iterable<T> | AsyncIterable<T>) {
            for await (const item of inputSeq) {
                if(filterCondition(item)) yield item;
            }
        }
        return new Sequence(apply_filter(this.seq));
    }

    map<TMap>(mappingFunction: (x: T) => TMap) : Sequence<TMap> {
        async function* apply_map(inputSeq: Iterable<T> | AsyncIterable<T>) {
            for await (const item of inputSeq) {
                yield mappingFunction(item);
            }
        }
        return new Sequence(apply_map(this.seq));
    }

    async reduce<TReduce>(reducingFunction: (acc: TReduce, val: T) => TReduce, initialValue?: TReduce): Promise<TReduce> {
        let accumulator: TReduce | undefined = undefined;
        if (initialValue !== undefined) {
            accumulator = initialValue;
        }

        for await (const item of this) {
            if (accumulator === undefined) {
                // @ts-ignore: this should be allowed if TReduce === T. I can't see a way to specify that.
                // However, the caller will get various prompts from TypeScript about issues.
                accumulator = item;
            } else {
                accumulator = reducingFunction(accumulator, item);
            }
        }

        if (accumulator === undefined) throw new Error("Can't reduce empty sequence with no initial value");
        return accumulator as TReduce;
    }

    // On an infinite sequence, this will never return.
    static async sum(sequence: Sequence<number>) {
        return sequence.reduce((acc, val) => acc + val, 0);
    }

    // On an infinite sequence, this will never return.
    static async max(sequence: Sequence<number>) {
        // Having no initialValue means this will throw on an empty sequence.
        return sequence.reduce((acc: number, val: number) => (acc > val) ? acc : val)
    }

    static async min(sequence: Sequence<number>) {
        // Having no initialValue means this will throw on an empty sequence.
        return sequence.reduce((acc: number, val: number) => (acc < val) ? acc : val)
    }

    static async maxObject(sequence: Sequence<any>, key: string) {
        return sequence.reduce((bestSoFar: any, currentItem: any) => {
            if (typeof currentItem[key] !== 'number') throw new Error("Key property must be a number");
            return (currentItem[key] > bestSoFar[key]) ? currentItem : bestSoFar;
        });
    }

    static async minObject(sequence: Sequence<any>, key: string) {
        return sequence.reduce((bestSoFar: any, currentItem: any) => {
            if (typeof currentItem[key] !== 'number') throw new Error("Key property must be a number");
            return (currentItem[key] < bestSoFar[key]) ? currentItem : bestSoFar;
        });
    }

    // On an infinite sequence, this will never return.
    static async count(sequence: Sequence<any>) {
        return Sequence.sum(sequence.map(s => 1));
    }
}

