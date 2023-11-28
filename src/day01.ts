
export function fn(filepath: string) {
    return "Hello, World!";
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./src/data/day01.txt";
    console.log(fn(filepath));
}
