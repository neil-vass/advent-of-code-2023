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



export function mapFnMultipleRanges(seedRanges: {min: number, max: number}[]) {
    // 50 98 2
    // 52 50 48
    const mapRanges = [
        { min: 98, max: 99, convert: (n: number) => n + -48 },
        { min: 50, max: 97, convert: (n: number) => n + 2 }
    ]

    let output = [];

    for (const seedRange of seedRanges) {
        const filtered = [];
        for (const mr of mapRanges) {
            if (seedRange.min > mr.max || seedRange.max < mr.min) {
                 continue;
            }

            filtered.push({
                min: Math.max(seedRange.min, mr.min),
                max: Math.min(seedRange.max, mr.max),
                convert: mr.convert
            });
        }

        // fill in unconverted ranges.
        let startOfNextRange = seedRange.min;
        const identity = (n: number) => n;

        for (const r of filtered) {
            if (r.min > seedRange.min) {
                output.push({
                    min: startOfNextRange,
                    max: r.min - 1,
                    convert: identity
                });
            }
            output.push(r);
            startOfNextRange = r.max + 1;
        }

        if (startOfNextRange < seedRange.max) {
            output.push({
                min: startOfNextRange,
                max: seedRange.max,
                convert: identity
            });
        }
    }

    output = output.map(val => ({
        min: val.convert(val.min),
        max: val.convert(val.max)})
    );
    return output;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day05.txt";
    console.log(await findLowestLocationNumber(filepath));
}