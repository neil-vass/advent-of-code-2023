import {expect, describe, it} from "vitest";
import {A_starSearch, breadthFirstSearch, FifoQueue, MinPriorityQueue} from "../src/graphSearch.js";

describe("Breadth first search", () => {
    it("Uses a FIFO queue", () => {
        const queue = new FifoQueue<string>();
        queue.push("A");
        queue.push("B");
        queue.push("C");

        expect(queue.pull()).toBe("A");
        expect(queue.isEmpty()).toBeFalsy();

        queue.push("D");
        expect(queue.pull()).toBe("B");
        expect(queue.pull()).toBe("C");
        expect(queue.pull()).toBe("D");

        expect(queue.isEmpty()).toBeTruthy();
        expect(queue.pull()).toBeNull();
    });

    it("Visits all reachable nodes", () => {
        const graph = {
            neighbours(node: string) {
                switch(node) {
                    case "A": return ["B", "C"];
                    case "B": return [];
                    case "C": return ["A"];
                    case "D": return ["C"];
                    default: throw new Error(`${node} is not a node`);
                }
            }
        }

        expect(breadthFirstSearch(graph, "A")).toStrictEqual(new Set(["A", "B", "C"]));
        expect(breadthFirstSearch(graph, "B")).toStrictEqual(new Set(["B"]));
        expect(breadthFirstSearch(graph, "D")).toStrictEqual(new Set(["A", "B", "C", "D"]));
    });
});

describe("A* search", () => {
    it("Uses a priority queue", () => {
        const queue = new MinPriorityQueue<string>();
        queue.push("A", 5);
        queue.push("B", 10);
        queue.push("C", 2);

        expect(queue.pull()).toBe("C");
        expect(queue.isEmpty()).toBeFalsy();

        queue.push("D", 6);
        queue.push("E", 12);

        expect(queue.pull()).toBe("A");
        expect(queue.pull()).toBe("D");
        expect(queue.pull()).toBe("B");
        expect(queue.pull()).toBe("E");

        expect(queue.isEmpty()).toBeTruthy();
        expect(queue.pull()).toBeNull();
    });

    it("Gets from A to B", () => {
        const graph = {
            neighbours(node: string) {
                switch(node) {
                    case "A": return [{node: "B", cost: 1}];
                    case "B": return [];
                    default: throw new Error(`${node} is not a node`);
                }
            },

            heuristic(from: string, to: string) {
                return 0;
            }
        }

        const result = A_starSearch(graph, "A", "B");
        const shortestRoute = result.get("B")!.costSoFar;
        expect(shortestRoute).toStrictEqual(1);

    });

    it("Takes shorter route with more nodes", () => {
        const graph = {
            neighbours(node: string) {
                switch(node) {
                    case "A": return [{node: "B", cost: 10}, {node: "C", cost: 2}];
                    case "B": return [];
                    case "C": return [{node: "A", cost: 2}, {node: "D", cost: 2}];
                    case "D": return [{node: "C", cost: 2}, {node: "B", cost: 2}];
                    default: throw new Error(`${node} is not a node`);
                }
            },

            heuristic(from: string, to: string) {
                return 0;
            }
        }

        const result = A_starSearch(graph, "A", "B");
        const shortestRoute = result.get("B")!.costSoFar;
        expect(shortestRoute).toStrictEqual(6);
    });

    // TODO: Can we demonstrate heuristic's working?

});
