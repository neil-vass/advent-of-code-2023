import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

type SchematicNum = { num: number, yPositions: number[] };
type SchematicSymbol = { char: string, xPos: number, yPos: number };

export class Schematic {

    private readonly numbers = new Array<Array<SchematicNum>>();
    private readonly symbols = new Array<SchematicSymbol>();

    private constructor() {}

    static async build(description: Sequence<string>) {
        let xPos = 0;
        const schematic = new Schematic();
        for await (const line of description) {

            // Schematic numbers
            const numsOnThisLine = new Array<SchematicNum>();
            for (const numMatch of line.matchAll(/\d+/g)) {
                numsOnThisLine.push({
                    num: +numMatch[0],
                    yPositions: Array.from(numMatch[0], (x, i) => i+numMatch.index!)
                })
            }
            schematic.numbers.push(numsOnThisLine);

            // Schematic symbols
            for (const symMatch of line.matchAll(/[^.0-9]/g)) {
                schematic.symbols.push({
                    char: symMatch[0],
                    xPos,
                    yPos: symMatch.index!
                })
            }
            xPos++;
        }
        return schematic;
    }

    private adjacentPartNumbers(sym: SchematicSymbol) {
        const partNums = new Array<number>();
        const yNeighbours = [sym.yPos, sym.yPos-1, sym.yPos+1];
        const xNeighbours = [sym.xPos];

        if (sym.xPos > 0) xNeighbours.push(sym.xPos-1);
        if (sym.xPos < this.numbers.length -1) xNeighbours.push(sym.xPos+1);

        for (const x of xNeighbours) {
            for (const schemaNum of this.numbers[x]) {
                const isAdjacent = yNeighbours.some(y => schemaNum.yPositions.includes(y));
                if (isAdjacent) partNums.push(schemaNum.num);
            }
        }

        return partNums;
    }

    partNumbers() {
        const partNums = new Array<number>();
        for (const sym of this.symbols) {
            partNums.push(...this.adjacentPartNumbers(sym));
        }
        return partNums;
    }

    gearRatios() {
        const gearRatios = new Array<number>();
        for (const sym of this.symbols) {
            if (sym.char === '*') {
                const partNums = this.adjacentPartNumbers(sym);
                if (partNums.length === 2) {
                    gearRatios.push(partNums[0] * partNums[1]);
                }
            }
        }
        return gearRatios;
    }
}

export async function findPartNumbers(schematicDescription: Sequence<string>) {
    const schematic = await Schematic.build(schematicDescription);
    return schematic.partNumbers();
}

export async function sumGearRatios(schematicDescription: Sequence<string>) {
    const schematic = await Schematic.build(schematicDescription);
    return schematic.gearRatios().reduce((acc, val) => acc + val);
}


// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const description = linesFromFile("./data/day03.txt");
    console.log(await sumGearRatios(description));
}