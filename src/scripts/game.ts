type Card = {
    title: string
    year: number
    image: string
}

const data: Card[] = [
    {
        title: 'Invention of the wheel',
        year: -3500,
        image: 'wheel.png',
    },
    {
        title: 'Destruction of pompeii',
        year: 79,
        image: 'pompeii.png',
    },
    {
        title: 'Inauguration of the coliseum',
        year: 80,
        image: 'coliseum.png',
    },
    {
        title: 'Invention of the toothbrush',
        year: 1498,
        image: 'toothbrush.png',
    },
    {
        title: 'Great fire of london',
        year: 1666,
        image: 'london-fire.png',
    },
    {
        title: 'Invention of the steam engine',
        year: 1712,
        image: 'steam-engine.png',
    },
    {
        title: 'Invention of shampoo',
        year: 1814,
        image: 'shampoo.png',
    },
    // {
    //     title: 'Invention of the revolver',
    //     year: 1836,
    //     image: 'revolver.png',
    // },
]

class Game {
    cards: Card[]
    indexedCards: Record<number, Card[]>
    placedCards: Card[] = []

    constructor(data: Card[]) {
        // Copy the cards
        this.cards = data

        // Index the cards by year
        this.indexedCards = data.reduce((acc, card) => {
            if (!acc[card.year]) {
                acc[card.year] = []
            }
            acc[card.year].push(card)
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
        
        return card
    }

    placeCard(card: Card) {
        this.placedCards.push(card)
    }
}

export const game = new Game(data)
