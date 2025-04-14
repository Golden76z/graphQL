// Const for the title depending on the level
export const levelObject = {
    1: "Aspiring developer",
    2: "Beginner developer",
    3: "Apprentice developer",
    4: "Assistant developer",
    5: "Basic developer",
    6: "Junior developer",
    7: "Confirmed developer",
    8: "Full-Stack developer"
}

export function checkLevel(level) {
    if (level < 10) {
        return 0
    } else if (level < 20) {
        return 1
    } else if (level < 30) {
        return 2
    } else if (level < 40) {
        return 3
    } else if (level < 50) {
        return 4
    } else if (level < 55) {
        return 5
    } else if (level < 60) {
        return 6
    } else {
        return 7
    }
}