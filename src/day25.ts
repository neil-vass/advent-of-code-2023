import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";
import {FifoQueue, Graph, Stack} from "./graphSearch.js";

type Component = string;

export function parseComponentConnections(s: string): [Component, Set<Component>] {
    const [thisComponent, connectionsStr] = s.split(": ");
    const connections = new Set(connectionsStr.split(" "));
    return [thisComponent, connections];
}

export function choose<T>(collection: Iterable<T>) {
    const arr = [...collection];
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
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


    reachableFrom(start: Component) {
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

    cutsToCauseDisconnect(knownMinCutsRequired=3) {
        // Karger’s algorithm: keep combining vertices until there are just 2 left.
        // It's a monte carlo algorithm... so this will do things in a different order each time it's called.
        // For better testability we could use a seeded random number generator, might come back to that.
        let cuts = new Array<[Component, Component]>();
        while (cuts.length !== knownMinCutsRequired) {
            const contractedGraph = new Map<Component, Set<Component>>(JSON.parse(JSON.stringify(Array.from(this.graph))));

            while(contractedGraph.size > 2) {
                // Pick 2 nodes to merge. a=Choose from map keys, b=choose from a's connections.
                const a = choose(contractedGraph.keys());
                console.log(`a is ${a}, choose from ${JSON.stringify(contractedGraph.get(a))}`)
                const b = choose(contractedGraph.get(a)!);

                // Merge: replace all references to b with a.
                contractedGraph.get(a)!.delete(b);
                for (const [c, links] of contractedGraph.entries()) {
                    if (links.has(b)) {
                        links.delete(b);
                        links.add(a)
                    }
                }
                contractedGraph.delete(b);
            }
            cuts = [...contractedGraph.keys()].map(key => [key, [...contractedGraph.get(key)!][0]])
        }
        return cuts;
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