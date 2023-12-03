# Templates for each day's puzzle

In the IntelliJ project pane on the left, right-click the project folder, choose New, then "Edit file templates..."

In that dialogue, I've added an "Advent of Code (TypeScript)" template.
The templates for them are here for easy reference / editing, can go and paste changes into that IDE dialogue.

Once the template's set up, it appears in the "New" list - when you choose this, you're prompted for a name, and
then 3 files get created (one in the src folder, one in test, one in data).

I've done this as a handy shortcut because each day's got a similar setup, and also to learn how this IDE feature works.


in `src/${NAME}.ts`:

```
import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

export function fn(filepath: string){
    return "Hello, World!";
}

// If this script was invoked directly on the command line:
if(`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/${NAME}.txt";
    console.log(fn(filepath));
}
```

in `test/${NAME}.test.ts`:

```
import {expect, describe, it} from "vitest";
import * as ${NAME} from "../src/${NAME}";

describe("#fn", () => {
    it("runs", () => {
        expect(${NAME}.fn("")).toBe("a real test");
    });
});
```

`data/${NAME}.txt` is blank, ready to paste the puzzle input into.