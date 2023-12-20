import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";
import {FifoQueue} from "./graphSearch.js";

export const LOW = "-low->";
export const HIGH = "-high->";

export type Pulse = "-low->" | "-high->";

export type ModuleName = string;

export type Signal = { sender: ModuleName, receiver: ModuleName, pulse: Pulse };

export class Module {
    constructor(readonly name: ModuleName, readonly receivers: ModuleName[]) {}

    receive(sender: ModuleName, pulse: Pulse): Signal[] {
        return [];
    }
}

export class Broadcaster extends Module {
    constructor(receivers: ModuleName[]) {
        super("broadcaster", receivers);
    }

    receive(sender: ModuleName, pulse: Pulse): Signal[] {
        return this.receivers.map(receiver => ({ sender: this.name, receiver, pulse }));
    }
}

export class FlipFlop extends Module {
    private isOn = false;

    receive(sender: ModuleName, pulse: Pulse): Signal[] {
        if (pulse === HIGH) {
            return [];
        } else {
            const sendPulse = this.isOn ? LOW : HIGH;
            this.isOn = !this.isOn;
            return this.receivers.map(receiver => ({ sender: this.name, receiver, pulse: sendPulse }));
        }
    }
}

export class Conjunction extends Module {
    private readonly inputStates = new Map<ModuleName, Pulse>();

    setInput(name: ModuleName) {
        this.inputStates.set(name, LOW);
    }

    receive(sender: ModuleName, pulse: Pulse): Signal[] {
        this.inputStates.set(sender, pulse);
        const allInputsHigh = [...this.inputStates.values()].every(v => v === HIGH);
        const sendPulse = allInputsHigh ? LOW : HIGH;
        return this.receivers.map(receiver => ({ sender: this.name, receiver, pulse: sendPulse }));
    }
}

export class System {
    private pulseQueue = new FifoQueue<Signal>();

    private constructor(private readonly modules: Map<string, Module>) {
        this.wireUpInputs();
    }

    wireUpInputs() {
        const conjunctions = [...this.modules.values()].filter(m => m instanceof Conjunction) as Conjunction[];
        for (const conj of conjunctions) {
            for (const sender of this.modules.values()) {
                if (sender.receivers.includes(conj.name)) {
                    conj.setInput(sender.name);
                }
            }
        }
    }

    pushTheButton(logging=false) {
        let [lowCount, highCount] = [0, 0];
        this.pulseQueue.push({ sender: "button", receiver: "broadcaster", pulse: LOW });
        while (!this.pulseQueue.isEmpty()) {
            const signal = this.pulseQueue.pull()!;
            signal.pulse === LOW ? lowCount++ : highCount++;

            if (logging) console.log(`${signal.sender} ${signal.pulse} ${signal.receiver}`);

            const receiver = this.modules.get(signal.receiver)
            if (receiver !== undefined) {
                const responses = receiver.receive(signal.sender, signal.pulse);
                responses.forEach(r => this.pulseQueue.push(r));
            }
        }
        return {lowCount, highCount};
    }

    static async buildFromDescription(lines: Sequence<string>) {
        const modules = new Map<string, Module>
        for await (const moduleDescription of lines) {
            const module = parseModule(moduleDescription);
            modules.set(module.name, module);
        }
        return new System(modules);
    }
}

export function parseModule(moduleDescription: string) {
    const broadMatch = moduleDescription.match(/^broadcaster -> (.+)$/);
    if (broadMatch !== null) {
        const receivers = broadMatch[1].split(", ");
        return new Broadcaster(receivers);
    }

    const flipMatch = moduleDescription.match(/^%(\w+) -> (.+)$/);
    if (flipMatch !== null) {
        const [, name, receiversStr] = flipMatch;
        const receivers = receiversStr.split(", ");
        return new FlipFlop(name, receivers);
    }

    const conjMatch = moduleDescription.match(/^&(\w+) -> (.+)$/);
    if (conjMatch === null) throw new Error(`Unrecognized format: ${moduleDescription}`);
    const [, name, receiversStr] = conjMatch;
    const receivers = receiversStr.split(", ");
    return new Conjunction(name, receivers);
}

export async function solvePart1(lines: Sequence<string>) {
    const system = await System.buildFromDescription(lines);
    let [lowTotal, highTotal] = [0, 0];
    for (let i=0; i<1000; i++) {
        const result = system.pushTheButton();
        lowTotal += result.lowCount;
        highTotal += result.highCount;
    }
    return lowTotal * highTotal;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const lines = linesFromFile("./data/day20.txt");
    console.log(await solvePart1(lines));
}