import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

type mapRange = {destinationRangeStart: number, sourceRangeStart: number, rangeLength: number};

export class Almanac {
    private seeds = new Array<number>();
    private maps = new Array<(n: number) => number>();

    private constructor() {}

    static builder = class Builder {
        private almanac = new Almanac();
        private currentMapName = "";
        private currentMapRanges: Array<mapRange> = [];

        addSeeds(seeds: Array<number>) {
            this.almanac.seeds.push(...seeds);
        }

        addMap(name: string) {
            if (this.currentMapName !== "") {
                const ranges = [...this.currentMapRanges]
                const mapFn = (n: number) => {
                    for (const r of ranges) {
                        if (n >= r.sourceRangeStart && n < (r.sourceRangeStart + r.rangeLength)) {
                            return r.destinationRangeStart + (n - r.sourceRangeStart);
                        }
                    }
                    return n;
                }

                this.almanac.maps.push(mapFn);
            }

            this.currentMapName = name;
            this.currentMapRanges = [];
        }

        addRangeForMap(destinationRangeStart: number, sourceRangeStart: number, rangeLength: number) {
            this.currentMapRanges.push({destinationRangeStart, sourceRangeStart, rangeLength});
        }

        complete() {
            this.addMap("");
            const val = this.almanac;
            this.almanac = new Almanac();
            return val;
        }
    }

    runMappings() {
        let converted = [...this.seeds];
        for (const fn of this.maps) {
            converted = converted.map(fn)
        }

        return this.seeds.map((seed, i) => [seed, converted[i]]);
    }
}
export async function parseAlmanac(lines: Sequence<string>) {
    const builder = new Almanac.builder();

    for await (const line of lines) {
        const seedMatch = line.match(/^seeds: ([ 0-9]+)$/);
        if (seedMatch !== null) {
            const seeds = seedMatch[1].match(/\d+/g)!.map(s => +s);
            builder.addSeeds(seeds);
            continue;
        }

        const mapNameMatch = line.match(/^(.+) map:$/);
        if (mapNameMatch !== null) {
            builder.addMap(mapNameMatch[1]);
            continue;
        }

        const mapRangeMatch = line.match(/^(\d+) (\d+) (\d+)$/);
        if (mapRangeMatch !== null) {
            const [, dest, src, len] = mapRangeMatch;
            builder.addRangeForMap(+dest, +src, +len);
            continue;
        }
    }

    return builder.complete();
}

export async function findLowestLocationNumber(filepath: string) {
    const lines = linesFromFile(filepath);
    const almanac = await parseAlmanac(lines);
    const locations = almanac.runMappings().map(val => val[1]);
    return Math.min(...locations);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day05.txt";
    console.log(await findLowestLocationNumber(filepath));
}