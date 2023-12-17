import { data, type Card } from './data'

class Game {
    data: Card[]

    constructor(data: Card[]) {
        this.data = data
    }
}

export const game = new Game(data)
