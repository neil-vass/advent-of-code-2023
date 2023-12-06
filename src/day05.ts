import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";


type Range = { min: number, max: number };
type MapRange = Range & { convert: (n: number) => number };

export class Almanac {
    private seedRanges = new Array<Range>();
    private maps = new Map<string, Array<MapRange>>();

    private constructor() {}

    static builder = class Builder {
        private almanac = new Almanac();
        private currentMapName = "";
        private currentMapRanges: Array<MapRange> = [];

        addSeeds(seeds: Array<number>) {
            for (let i=0; i < seeds.length-1; i++) {
                this.almanac.seedRanges.push({
                    min: seeds[i],
                    max: seeds[i] + seeds[i+1] -1
                });
            }
        }

        addMap(name: string) {
            if (this.currentMapName !== "") {
                this.almanac.maps.set(this.currentMapName, this.currentMapRanges);
            }

            this.currentMapName = name;
            this.currentMapRanges = [];
        }

        addRangeForMap(destinationRangeStart: number, sourceRangeStart: number, rangeLength: number) {
            this.currentMapRanges.push({
                min: sourceRangeStart,
                max: sourceRangeStart + rangeLength -1,
                convert: (n) => n + (destinationRangeStart - sourceRangeStart)
            });
        }

        complete() {
            this.addMap("");
            const val = this.almanac;
            this.almanac = new Almanac();
            return val;
        }
    }

    runMappings() {
        let converted = [...this.seedRanges];
        for (const mapRanges of this.maps.values()) {
            converted = mapFnMultipleRanges(converted, mapRanges);
        }

        return converted;
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

export function mapFnMultipleRanges(seedRanges: Range[], mapRanges: MapRange[]) {
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

export async function solvePart2(filepath: string) {
    const lines = linesFromFile(filepath);
    const almanac = await parseAlmanac(lines);
    const locations = almanac.runMappings();
    console.log(locations)
    const minLocation = Math.min(...locations.map(val => val.min));
    return minLocation;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day05.txt";
    console.log(await solvePart2(filepath));
}