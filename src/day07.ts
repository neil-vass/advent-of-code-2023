import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";
import {MinPriorityQueue} from "./graphSearch.js";

export enum HandType {
    HighCard =0,
    Pair =1,
    TwoPair =2,
    ThreeOfAKind =4,
    FullHouse =5,
    FourOfAKind =6,
    FiveOfAKind =7
}

function cardValuesAndCounts(hand: string) {
    const counter = new Map<string, number>();
    for (const card of hand) {
        const newCount = counter.has(card) ? counter.get(card)! + 1 : 1;
        counter.set(card, newCount);
    }
    return counter;
}

function cardCountsInOrder(valuesAndCounts: Map<string, number>) {
    return [...valuesAndCounts.values()].sort((a,b) => b-a);
}

function cardCountsInOrderUsingJokers(valuesAndCounts: Map<string, number>) {
    let jokerCount = 0;
    if (valuesAndCounts.has("J")) {
        jokerCount = valuesAndCounts.get("J")!;
        if (jokerCount === 5) return [5];
        valuesAndCounts.delete("J");
    }
    const totals = [...valuesAndCounts.values()].sort((a,b) => b-a);
    totals[0] += jokerCount;
    return totals;
}

function handTypeFromCardCounts(countsInOrder: Array<number>) {
    if(countsInOrder[0] === 5) return HandType.FiveOfAKind;
    if(countsInOrder[0] === 4) return HandType.FourOfAKind;
    if(countsInOrder[0] === 3 && countsInOrder[1] === 2) return HandType.FullHouse;
    if(countsInOrder[0] === 3) return HandType.ThreeOfAKind;
    if(countsInOrder[0] === 2 && countsInOrder[1] === 2) return HandType.TwoPair;
    if(countsInOrder[0] === 2) return HandType.Pair;
    return HandType.HighCard;
}

export function getHandType(hand: string, countingFn=cardCountsInOrder) {
    const valuesAndCounts = cardValuesAndCounts(hand);
    const countsInOrder = countingFn(valuesAndCounts);
    return handTypeFromCardCounts(countsInOrder);
}

export function getHandTypeWithJokers(hand: string) {
    return getHandType(hand, cardCountsInOrderUsingJokers);
}

export function scoreHand(hand: string, handType: HandType) {
    const cardValues = "J23456789TJQKA".split("");
    let mul = 1;
    let score = 0;
    for (let i = hand.length-1; i >= 0; i--) {
        score += (cardValues.indexOf(hand[i]) * mul);
        mul *= 100;
    }

    score += (handType * mul);
    return score;
}


function calculateWinnings(queue: MinPriorityQueue<number>) {
    let winnings = 0;
    let rank = 1;
    while (!queue.isEmpty()) {
        winnings += queue.pull()! * rank;
        rank++;
    }
    return winnings;
}

async function parseAndRank(handsAndBids: Sequence<string>, handTypeFn: (hand: string) => HandType) {
    const queue = new MinPriorityQueue<number>();
    for await (const line of handsAndBids) {
        const [hand, bid] = line.split(" ");
        const handType = handTypeFn(hand);
        const priority = scoreHand(hand, handType);
        queue.push(+bid, priority);
    }
    return queue;
}

export async function solvePart1(handsAndBids: Sequence<string>) {
    const queue = await parseAndRank(handsAndBids, getHandType);
    return calculateWinnings(queue);
}

export async function solvePart2(handsAndBids: Sequence<string>) {
    const queue = await parseAndRank(handsAndBids, getHandTypeWithJokers);
    return calculateWinnings(queue);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day07.txt";
    const lines = linesFromFile(filepath)
    console.log(await solvePart2(lines));
}