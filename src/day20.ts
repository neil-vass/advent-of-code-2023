import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";
import {FifoQueue} from "./graphSearch.js";
import {sign} from "crypto";

export const LOW = "-low->";
export const HIGH = "-high->";

export type Pulse = "-low->" | "-high->";

export type ModuleName = string;

export type Signal = { sender: ModuleName, receiver: ModuleName, pulse: Pulse };

export class Module {
    constructor(readonly name: ModuleName) {}

    receive(sender: ModuleName, pulse: Pulse): Signal[] {
        return [];
    }
}

export class Broadcaster extends Module {
    constructor(readonly receivers: ModuleName[]) {
        super("broadcaster");
    }

    receive(sender: ModuleName, pulse: Pulse): Signal[] {
        return this.receivers.map(receiver => ({ sender: this.name, receiver, pulse }));
    }
}

export class FlipFlop extends Module {
    private isOn = false;

    constructor(name: ModuleName, private readonly receiver: ModuleName) {
        super(name);
    }

    receive(sender: ModuleName, pulse: Pulse): Signal[] {
        if (pulse === HIGH) {
            return [];
        } else {
            const sendPulse = this.isOn ? LOW : HIGH;
            this.isOn = !this.isOn;
            return [{ sender: this.name, receiver: this.receiver, pulse: sendPulse }];
        }
    }
}

export class Conjunction extends Module {
    private readonly inputStates = new Map<ModuleName, Pulse>();
    constructor(name: ModuleName, private readonly receiver: ModuleName) {
        super(name);
    }

    setInput(name: ModuleName) {
        this.inputStates.set(name, LOW);
    }

    receive(sender: ModuleName, pulse: Pulse): Signal[] {
        this.inputStates.set(sender, pulse);
        const allInputsHigh = [...this.inputStates.values()].every(v => v === HIGH);
        const sendPulse = allInputsHigh ? LOW : HIGH;
        return [{ sender: this.name, receiver: this.receiver, pulse: sendPulse }];
    }
}

export class System {
    private pulseQueue = new FifoQueue<Signal>();

    private constructor(private readonly modules: Map<string, Module>) {}


    pushTheButton() {
        let [lowCount, highCount] = [0, 0];
        this.pulseQueue.push({ sender: "button", receiver: "broadcaster", pulse: LOW });
        while (!this.pulseQueue.isEmpty()) {
            const signal = this.pulseQueue.pull()!;
            const receiver = this.modules.get(signal.receiver)!
            const responses = receiver.receive(signal.sender, signal.pulse);
            responses.forEach(r => this.pulseQueue.push(r));
            signal.pulse === LOW ? lowCount++ : highCount++;
        }
        return lowCount * highCount;
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

    const flipMatch = moduleDescription.match(/^%(\w+) -> (\w+)$/);
    if (flipMatch !== null) {
        const [, name, receiver] = flipMatch;
        return new FlipFlop(name, receiver);
    }

    const conjMatch = moduleDescription.match(/^&(\w+) -> (\w+)$/);
    if (conjMatch === null) throw new Error(`Unrecognized format: ${moduleDescription}`);
    const [, name, receiver] = conjMatch;
    return new Conjunction(name, receiver);

}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day20.txt";
}