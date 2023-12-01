import readline from "node:readline/promises";
import fs from "fs";
import {Sequence} from "./sequence.js";

export function singleLineFromFile(path: string) {
    return fs.readFileSync(path, "utf8").trimEnd();
}

export function linesFromFile(path: string) : Sequence<string> {
    async function* readFile() {
        for await (const line of readline.createInterface({input: fs.createReadStream(path)})) {
            yield line;
        }
    }
    return new Sequence(readFile());
}

export function permutations<T>(arr: T[]): Sequence<T[]> {

    // Heap's algorithm: a "decrease and conquer" method.
    // Operates on 'k' elements of the array at each step
    // (k starts at array's length and decreases by one each step).
    function* generatePermutations<T>(arr: T[], k: number = arr.length): Iterable<T[]> {
        if (k === 1) {
            yield [...arr];
        } else {
            for (let i = 0; i < k; i++) {
                yield* generatePermutations(arr, k - 1);
                if (k % 2 === 0) {
                    [arr[i], arr[k - 1]] = [arr[k - 1], arr[i]];
                } else {
                    [arr[0], arr[k - 1]] = [arr[k - 1], arr[0]];
                }
            }
        }
    }

    return new Sequence(generatePermutations(arr));
}


export class MinPriorityQueue {
    private heap = new Array<[string, number]>();

    // Add element to the queue with given priority.
    push(elem: string, priority: number) {
        this.heap.push([elem, priority]);
        this.siftUp();
    }

    // Remove the element with the smallest priority from the
    // queue and return it.
    pullMinElement() {
        if (this.heap.length === 0) return null;
        this.swap(0, this.heap.length -1);
        const [elem, ] = this.heap.pop()!;
        this.siftDown();
        return elem;
    }

    // After adding a new element to the bottom of the
    // binary heap, keep sifting it up until it's no longer
    // smaller priority than its immediate parent.
    private siftUp() {
        let currentIndex = this.heap.length -1;

        while (currentIndex > 0) {
            const parentIndex = Math.ceil((currentIndex/2) -1);

            if (this.isHigherPriority(currentIndex, parentIndex)) return;

            this.swap(currentIndex, parentIndex);
            currentIndex = parentIndex;
        }
    }

    // After moving an element to the top of the binary heap,
    // keep sifting it down until it's no longer smaller priority
    // than its children.
    private siftDown() {
        let currentIndex = 0;

        while (true) {
            const childIndex = this.lowestPriorityChild(currentIndex);

            if (childIndex === null) return;
            if (this.isHigherPriority(childIndex, currentIndex)) return;

            this.swap(currentIndex, childIndex);
            currentIndex = childIndex;
        }
    }

    private isHigherPriority(idx1: number, idx2: number) {
        return this.heap[idx1][1] > this.heap[idx2][1];
    }

    private swap(idx1: number, idx2: number) {
        [this.heap[idx1], this.heap[idx2]] = [this.heap[idx2], this.heap[idx1]];
    }

    private lowestPriorityChild(idx: number) {
        const leftChildIndex = (2*idx) +1;
        if (leftChildIndex >= this.heap.length) return null;

        const rightChildIndex = leftChildIndex +1;
        if (rightChildIndex >= this.heap.length) return leftChildIndex;

        return this.isHigherPriority(leftChildIndex, rightChildIndex) ? rightChildIndex : leftChildIndex;
    }
}