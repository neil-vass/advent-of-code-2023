import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

export function parseCard(s: string) {
    const m = s.match(/^Card\s+(\d+): ([ 0-9]*) \| ([ 0-9]*)$/);
    if (m === null) throw new Error(`Unexpected line format ${s}`);
    const [, cardStr, winsStr, picksStr] = m;

    const cardNum = +cardStr;
    const winning = winsStr.match(/\d+/g)!;
    const picks = picksStr.match(/\d+/g)!;
    const winCount = picks.filter(p => winning.includes(p)).length;
    return { cardNum, winCount };
}

export async function sumCardValues(cards: Sequence<string>) {
    const cardValues = cards.map(c => parseCard(c)).map(c =>
        (c.winCount < 2) ? c.winCount : Math.pow(2, c.winCount-1)
    );
    return Sequence.sum(cardValues);
}

export async function winMoreScratchcards(cards: Sequence<string>) {
    const cardsWithCounts = await cards.map(c => { return {...parseCard(c), copies: 1} }).toArray();

    // Card #1 is at index 0, #2 is at 1, etc. ... so this offset works.
    for (const card of cardsWithCounts) {
        for (let i = 0; i < card.winCount; i++) {
            cardsWithCounts[card.cardNum+i].copies += card.copies;
        }
    }

    const totalCards = cardsWithCounts.reduce((acc, val) => acc + val.copies, 0);
    return totalCards
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day04.txt";
    const cards = linesFromFile(filepath);
    console.log(await winMoreScratchcards(cards));
}