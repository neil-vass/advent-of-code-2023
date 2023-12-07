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

export function getHandType(hand: string) {
    const counter = new Map<string, number>();
    for (const c of hand) {
        const newCount = counter.has(c) ? counter.get(c)! +1 : 1;
        counter.set(c, newCount);
    }

    const totals = [...counter.values()].sort((a,b) => b-a);
    if(totals[0] === 5) return HandType.FiveOfAKind;
    if(totals[0] === 4) return HandType.FourOfAKind;
    if(totals[0] === 3 && totals[1] === 2) return HandType.FullHouse;
    if(totals[0] === 3) return HandType.ThreeOfAKind;
    if(totals[0] === 2 && totals[1] === 2) return HandType.TwoPair;
    if(totals[0] === 2) return HandType.Pair;
    return HandType.HighCard;
}

const cardValues = "J23456789TJQKA".split("");
export function scoreHand(hand: string) {
    let mul = 1;
    let score = 0;
    for (let i = hand.length-1; i >= 0; i--) {
        score += (cardValues.indexOf(hand[i]) * mul);
        mul *= 100;
    }

    score += (getHandType(hand) * mul);
    return score;
}


export async function solvePart1(cardsAndBids: Sequence<string>) {
   const queue = new MinPriorityQueue<number>();
   for await (const line of cardsAndBids) {
       const [hand, bid] = line.split(' ');
       const priority = scoreHand(hand);
       queue.push(+bid, priority);
       console.log(hand)
   }

   let winnings = 0;
   let rank = 1;
   while (!queue.isEmpty()) {
       winnings += queue.pull()! * rank;
       rank++;
   }

   return winnings;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day07.txt";
    const lines = linesFromFile(filepath)
    console.log(await solvePart1(lines));
}