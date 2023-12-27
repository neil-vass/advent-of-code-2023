import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";
import {Stack} from "./graphSearch.js";
import seedrandom from "seedrandom";
import {expect} from "vitest";

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
        this.removeSelflinks();
        this.insertBacklinks();
    }

    static async buildFromDescription(lines: Sequence<string>) {
        const description = await lines.map(parseComponentConnections).toArray()
        const graph = new Map(description);
        return new Apparatus(graph);
    }

    private removeSelflinks() {
        for (const [thisComponent, connections] of this.graph.entries()) {
            const updatedConnections = connections.filter(c => c !== thisComponent);
            this.graph.set(thisComponent, updatedConnections);
        }
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

    findMinCut(monteCarloIterations=100, randomNumberGenerator=seedrandom()) {
        // Karger’s algorithm: keep combining vertices until there are just 2 left.
        // It's a monte carlo algorithm... so this will do things in a different order each time it's called.
        // For better testability you can pass in a seeded randomNumberGenerator.
        let bestResultSoFar = { numWiresToCut: Infinity, groupSizes: new Array<number> };

        for (let i=0; i< monteCarloIterations; i++) {
            const contractedGraph = this.copyGraph();
            const mergers = new Map(Array.from(contractedGraph.keys(), (k) => [k, new Array<Component>()]));

            while(contractedGraph.size > 2) {
                // Choose 2 nodes to merge: Node to grow from map keys, one of its connections to absorb.
                const nodeToGrow = choose(contractedGraph.keys(), randomNumberGenerator);
                const linksFromNodeToGrow = contractedGraph.get(nodeToGrow)!;
                const nodeToAbsorb = choose(linksFromNodeToGrow, randomNumberGenerator);

                // Merge: replace all references to nodeToAbsorb.
                const updatedLinksFromNodeToGrow = linksFromNodeToGrow.filter(link => link !== nodeToAbsorb);
                contractedGraph.set(nodeToGrow, updatedLinksFromNodeToGrow);

                for (const otherComponent of contractedGraph.get(nodeToAbsorb)!) {
                    if (otherComponent === nodeToGrow) continue;
                    const otherComponentsLinks = contractedGraph.get(otherComponent)!;
                    const idxToChange = otherComponentsLinks.indexOf(nodeToAbsorb);
                    otherComponentsLinks.splice(idxToChange, 1, nodeToGrow);
                    updatedLinksFromNodeToGrow.push(otherComponent);
                }
                contractedGraph.delete(nodeToAbsorb);

                // Record the merger.
                let mergedNodes = mergers.get(nodeToGrow)!;
                mergedNodes.push(nodeToAbsorb);
                if (mergers.has(nodeToAbsorb)) {
                    mergedNodes = mergedNodes.concat(mergers.get(nodeToAbsorb)!);
                }
                mergers.set(nodeToGrow, mergedNodes);
                mergers.delete(nodeToAbsorb);
            }

            const numWiresToCut = Array.from(contractedGraph.values(), (v) => v.length)[0];

            if (numWiresToCut < bestResultSoFar.numWiresToCut) {
                const groupSizes = Array.from(mergers.values(), (v) => v.length+1);
                groupSizes.sort(ascending);
                bestResultSoFar = { numWiresToCut, groupSizes };
            }
        }

        return bestResultSoFar;
    }
}


export async function solvePart1(lines: Sequence<string>) {
    const apparatus = await Apparatus.buildFromDescription(lines);
    const iterations = 100;
    const rng = seedrandom("String for seed to get same series");
    const minCut = apparatus.findMinCut(iterations, rng);

    if (minCut.numWiresToCut !== 3) throw new Error(`More iterations needed!`);
    return minCut.groupSizes[0] * minCut.groupSizes[1];
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const lines = linesFromFile("./data/day25.txt");
    console.log(await solvePart1(lines));
}