import {singleLineFromFile} from "./helpers.js";

export function hash(s: string) {
    let currentValue = 0;
    for (let i=0; i < s.length; i++) {
        currentValue += s.charCodeAt(i);
        currentValue *= 17;
        currentValue %= 256;
    }
    return currentValue;
}

// Instructions are either "rm=1" or "cm-" format.
// If op is "-", focal will be NaN as it's not relevant.
type Instruction = { label: string, op: string, focal: number };

export function parseInstruction(instruction: string): Instruction {
    const m = instruction.match(/^(\w+)([=-])(\d)?$/);
    if (m === null) throw new Error(`Unrecognized instruction: ${instruction}`);
    const [, label, op, focalStr] = m;
    return {label, op, focal: +focalStr};
}


export class Tunnel {
    private boxes = Array.from({length: 256}, () => new Map<string, number>());

    execute(instructionStr: string) {
        const instruction = parseInstruction(instructionStr);
        const boxId = hash(instruction.label);
        switch (instruction.op) {
            case "=":
                this.boxes[boxId].set(instruction.label, instruction.focal);
                return;
            case "-":
                this.boxes[boxId].delete(instruction.label);
                return;
        }
    }

    contents() {
        const output = new Array<string>();
        for (const [id, lenses] of this.boxes.entries()) {
            if (lenses.size > 0) {
                let line = `Box ${id}:`;
                for (const [label, focal] of lenses) {
                    line += ` [${label} ${focal}]`;
                }
                output.push(line);
            }
        }
        return output;
    }

    focusingPower() {
        let total = 0;
        for (const [boxId, lenses] of this.boxes.entries()) {
            const boxMultiplier = boxId +1;
            let slotNumber = 0;
            for (const focalLength of lenses.values()) {
                slotNumber++;
                total += boxMultiplier * slotNumber * focalLength;
            }
        }
        return total;
    }
}

export function solvePart1(s: string) {
    return s.split(",").map(hash).reduce((a,b) => a+b);
}

export function solvePart2(s: string) {
    const tunnel = new Tunnel();
    s.split(",").forEach(i => tunnel.execute(i));
    return tunnel.focusingPower();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const s = singleLineFromFile("./data/day15.txt");
    console.log(solvePart2(s));
}