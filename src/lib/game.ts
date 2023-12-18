import { writable, type Writable } from "svelte/store"
import { data, type Card } from "./data"

const initial_data = {
    deck: data,
    cards_copy: [...data],
    board: [] as Card[],
    hand: [] as Card[],
}

export type GameData = typeof initial_data
export const gameData: Writable<typeof initial_data> = writable(initial_data)

class Game {
    deck: Card[] // cards will be progressively removed from this array
    cards_copy: Card[] // copy of the cards array, to reset the game
    // indexedCards: Record<number, Card[]>
    placedCards: Card[] = [] // cards that have been placed on the board

    constructor(data: Card[]) {
        this.deck = data

        // Keep a copy of the cards
        this.cards_copy = [...data]

        // Index the cards by year
        // this.indexedCards = data.reduce((acc, card) => {
        //     const slot = acc[card.year]
        //     if (!slot) {
        //         acc[card.year] = []
        //     }
        //     acc[card.year]!.push(card)

        //     return acc
        // } , {} as Record<number, Card[]>)

        // Insert the initial card for the game
        this.placedCards.push(this.getRandomCard())
    }

    /**
     * Gets a random card from the deck, removing it
     * @returns the random card
     */
    getRandomCard(): Card {
        const index = Math.floor(Math.random() * this.deck.length)

        // Remove the card from the deck
        const [card] = this.deck.splice(index, 1)

        if (!card) {
            // This should never happen, just for TS linter
            throw new Error("Something went wrong")
        }
        
        return card
    }
}

export const game = new Game(data)
