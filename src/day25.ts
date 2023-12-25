import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";
import {FifoQueue, Graph, Stack} from "./graphSearch.js";
import {c} from "vitest/dist/reporters-5f784f42.js";

type Component = string;

export function parseComponentConnections(s: string): [Component, Set<Component>] {
    const [thisComponent, connectionsStr] = s.split(": ");
    const connections = new Set(connectionsStr.split(" "));
    return [thisComponent, connections];
}

export class Apparatus {
    private constructor(readonly graph: Map<Component, Set<Component>>) {
        this.insertBacklinks();
    }

    static async buildFromDescription(lines: Sequence<string>) {
        const description = await lines.map(parseComponentConnections).toArray()
        const graph = new Map(description);
        return new Apparatus(graph);
    }

    private insertBacklinks() {
        for (const [thisComponent, connections] of this.graph.entries()) {
            for (const linked of connections) {
                const linkedEntry = this.graph.get(linked);
                if (linkedEntry === undefined) {
                    this.graph.set(linked, new Set([thisComponent]));
                } else {
                    linkedEntry.add(thisComponent);
                }
            }
        }
    }


    reachableFrom<TNode>(start: Component) {
        const frontier = new Stack<Component>();
        const reached = new Set<Component>();

        frontier.push(start);
        reached.add(start);

        while (!frontier.isEmpty()) {
            const current = frontier.pull()!;
            for (const n of this.graph.get(current)!) {
                if (!reached.has(n)) {
                    frontier.push(n);
                    reached.add(n);
                }
            }
        }

        return reached;
    }

    connectedGroupSizes() {
        let unassignedComponents = Array.from(this.graph.keys());
        const groupSizes = new Array<number>();
        while(unassignedComponents.length > 0) {
            const group = this.reachableFrom(unassignedComponents[0]);
            groupSizes.push(group.size);
            unassignedComponents = unassignedComponents.filter(c => !group.has(c)) // Set difference.
        }
        return groupSizes;
    }

    cutWire(a: Component, b: Component) {
        this.graph.get(a)?.delete(b);
        this.graph.get(b)?.delete(a);
    }
}


export function fn(filepath: string) {
    return "Hello, World!";
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day25.txt";
    console.log(fn(filepath));
}