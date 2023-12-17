import { data, type Card } from "./data"

class Game {
    cards: Card[]
    indexedCards: Record<number, Card[]>
    placedCards: Card[] = []

    constructor(data: Card[]) {
        // Copy the cards
        this.cards = data

        // Index the cards by year
        this.indexedCards = data.reduce((acc, card) => {
            const slot = acc[card.year]
            if (!slot) {
                acc[card.year] = []
            }
            acc[card.year]!.push(card)

            return acc
        } , {} as Record<number, Card[]>)

        // Insert the first card
        const initial_card = this.getRandomCard()
        console.log({ initial_card })
        this.placeCard(initial_card)
    }

    getRandomCard(): Card {
        const index = Math.floor(Math.random() * this.cards.length)

        // Remove the card from the deck
        const [card] = this.cards.splice(index, 1)

        if (!card) {
            throw new Error("Something went wrong")
        }
        
        return card
    }

    placeCard(card: Card) {
        this.placedCards.push(card)
    }
}

export const game = new Game(data)
