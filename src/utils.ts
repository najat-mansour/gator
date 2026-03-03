export function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);

    if (!match) {
        throw new Error(`Invalid Format, use Xunit where unit can be: ms | s | m | h`);
    }
    
    const number = Number(match[1]);
    const unit = match[2];

    if (unit === "ms")
        return number;

    if (unit === "s")
        return number * 1000;

    if (unit === "m")
        return number * 60 * 1000;

    return number * 60 * 60 * 1000;
}