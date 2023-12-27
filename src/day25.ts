import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";
import {Stack} from "./graphSearch.js";
import seedrandom from "seedrandom";

type Component = string;

const ascending = (left: number, right: number) => left - right;

export function parseComponentConnections(s: string): [Component, Array<Component>] {
    const [thisComponent, connectionsStr] = s.split(": ");
    const connections = connectionsStr.split(" ");
    return [thisComponent, connections];
}

export function choose<T>(collection: Iterable<T>, randomNumberGenerator=seedrandom()) {
    const arr = [...collection];
    const idx = Math.floor(randomNumberGenerator() * arr.length);
    return arr[idx];
}

export class Apparatus {
    private constructor(readonly graph: Map<Component, Array<Component>>) {
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
                    this.graph.set(linked, [thisComponent]);
                } else {
                    if (linkedEntry.indexOf(thisComponent) === -1) {
                        linkedEntry.push(thisComponent);
                    }
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
        const aToB = this.graph.get(a)!.indexOf(b);
        const bToA = this.graph.get(b)!.indexOf(a);
        this.graph.get(a)!.splice(aToB, 1);
        this.graph.get(b)!.splice(bToA, 1);
    }

    copyGraph() {
        return new Map([...this.graph.entries()].map(([k,v]) => [k, Array.from(v)]));
    }

    groupSizesAfterMinCut(monteCarloIterations=100, randomNumberGenerator=seedrandom()) {
        // Karger’s algorithm: keep combining vertices until there are just 2 left.
        // It's a monte carlo algorithm... so this will do things in a different order each time it's called.
        // For better testability we could use a seeded random number generator, might come back to that.
        let bestResultSoFar = { mergedEdgesCount: 0, groupSizes: new Array<number> };

        for (let i=0; i< monteCarloIterations; i++) {
            const contractedGraph = this.copyGraph();
            const mergers = new Map(Array.from(contractedGraph.keys(), (k) => [k, new Array<Component>()]));
            let mergedEdgesCount = 0;

            while(contractedGraph.size > 2) {
                // Pick 2 nodes to merge. a=Choose from map keys, b=choose from a's connections.
                const a = choose(contractedGraph.keys(), randomNumberGenerator);
                const linksFromA = contractedGraph.get(a)!;
                const b = choose(linksFromA, randomNumberGenerator);

                // Merge: replace all references to b with a.
                const linksFromAWithoutB = linksFromA.filter(link => link !== b);
                mergedEdgesCount += linksFromA.length -  linksFromAWithoutB.length;
                contractedGraph.set(a, linksFromAWithoutB);

                for (const otherComponent of contractedGraph.get(b)!) {
                    if (otherComponent === a) continue;
                    const otherComponentsLinks = contractedGraph.get(otherComponent)!;
                    const linkToBIndex = otherComponentsLinks.indexOf(b);
                    otherComponentsLinks.splice(linkToBIndex, 1, a);
                    linksFromA.push(otherComponent);
                }
                contractedGraph.delete(b);

                // Record the merger.
                let mergedNodes = mergers.get(a)!;
                mergedNodes.push(b);
                if (mergers.has(b)) {
                    mergedNodes = mergedNodes.concat(mergers.get(b)!);
                }
                mergers.set(a, mergedNodes);
                mergers.delete(b);
            }

            if (mergedEdgesCount > bestResultSoFar.mergedEdgesCount) {
                const groupSizes = Array.from(mergers.values(), (v) => v.length+1);
                groupSizes.sort(ascending);
                bestResultSoFar = { mergedEdgesCount, groupSizes };
            }
        }

        return bestResultSoFar.groupSizes;
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