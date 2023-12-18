<script lang="ts">
    import Card from '$lib/components/Card.svelte'
    import Image from '$lib/components/Image.svelte'
    import { gameData, type GameData } from '$lib/game'
    import { onMount } from 'svelte'

    // Game is needed because you cannot use $gameData directly in the script
    let game: GameData = {
        deck: [],
        cards_copy: [],
        board: [],
        hand: [],
    }
    gameData.subscribe(data => (game = data))

    /**
     * Start the game
     */
    function startGame(): void {
        startingCard()
        pickCardsFromDeck(3)
    }
    // ------------------------------------
    //                UTILS
    // ------------------------------------
    function pickCardsFromDeck(quantity: number) {
        while (quantity > 0) {
            // Pick a random card from the deck
            const index = Math.floor(Math.random() * game.deck.length)

            // Move the card from the deck to the hand
            gameData.update(data => {
                data.hand.push(data.deck[index]!)
                data.deck.splice(index, 1)
                return data
            })

            quantity--
        }
    }

    function startingCard() {
        // Pick a random card from the deck
        const index = Math.floor(Math.random() * game.deck.length)

        // Move the card from the deck to the board
        gameData.update(data => {
            data.board.push(data.deck[index]!)
            data.deck.splice(index, 1)
            return data
        })
    }

    // function placeItOnBoard() {
    //     // Place the card from your hand on the board
    //     gameData.update(data => {
    //         data.board.push(data.cardOnHand!)
    //         data.cardOnHand = null
    //         return data
    //     })
    // }
    // Each time we modify the DOM, we need to assign the event listeners again
    function assignEventListeners() {
        // https://www.youtube.com/watch?v=jfYWwQrtzzY
        // The cards that can be dragged (the ones in your hand)
        const draggables = document.querySelectorAll('.draggable')

        // The containers where you can drop the cards (hand and board)
        const containers = document.querySelectorAll('.draggable-box')

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => {
                draggable.classList.add('dragging')
            })

            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging')

                // After dropping any card
                validateCardsSorting()
            })
        })

        containers.forEach(container => {
            console.log(container.appendChild)
            container.addEventListener('dragover', e => {
                // Allow the drop
                e.preventDefault()

                const afterElement = getDragAfterElement(container as HTMLElement, (e as DragEvent).clientX)
                const draggable = document.querySelector('.dragging')!

                if (!afterElement) {
                    container.appendChild(draggable)
                } else {
                    container.insertBefore(draggable, afterElement)
                }
            })
        })
    }

    // Allow to place the card between two specific cards inside the container
    function getDragAfterElement(container: HTMLElement, x: number): Element | undefined {
        // Get all draggable elements except the one that is being dragged
        const cards = [...container.querySelectorAll('.card:not(.dragging)')]

        return cards.reduce(
            (closest, nextChild) => {
                const box = nextChild.getBoundingClientRect()
                const offset = x - box.left - box.width / 2

                // If the offset is negative, the card is above the middle of the card
                // If the offset is positive, the card is below the middle of the card
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: nextChild }
                } else {
                    return closest
                }
            },
            { offset: Number.NEGATIVE_INFINITY, element: undefined as Element | undefined },
        ).element
    }

    // Check if the cards on the board are sorted correctly
    function validateCardsSorting() {
        const cards = [...document.getElementById('board')!.querySelectorAll('.card')!]
        console.log('validating length...', cards.length)
    }

    onMount(() => {
        startGame()

        // Wait 2s
        setTimeout(() => {
            // Assign the event listeners
            assignEventListeners()
        }, 200)
    })

    const styles = {
        base: 'text-2xl font-bold card p-4 rounded bg-zinc-500 w-24 h-24 flex items-center justify-center',
    }
</script>

<!-- Here the cards will appear, you can sort them freely -->
<h1 class="font-bold my-4">PLAYER'S HAND</h1>
<section id="hand" class="draggable-box bg-zinc-800 p-8 flex gap-4 overflow-x-scroll">
    <div class="{styles.base} draggable cursor-move" draggable="true">1</div>
    <div class="{styles.base} draggable cursor-move" draggable="true">2</div>
    <div class="{styles.base} draggable cursor-move" draggable="true">4</div>
    <div class="{styles.base} draggable cursor-move" draggable="true">5</div>

    <div
        class="bg-zinc-500 w-42 h-full p-2 rounded shadow card draggable cursor-move flex flex-col items-center justify-center"
        draggable="true"
    >
        <h2 class="font-bold pb-2">Destruction of pompeii</h2>
        <div class="w-32 h-32">
            <Image src="/images/cards/pompeii.png" />
        </div>
        <p class="text-center pt-1">year: 1700</p>
    </div>

    <Card card={{ title: 'Rome whatever', image: 'coliseum.png', year: 174230 }} showYear={false} />

    {#each $gameData.hand as card}
        <Card {card} showYear={false} />
    {/each}
</section>

<!-- Here you need to place the cards sorted to gain points -->
<h1 class="font-bold my-4">BOARD</h1>
<section id="board" class="draggable-box bg-zinc-800 p-8 flex gap-4 overflow-x-scroll">
    <div class="{styles.base} text-black" draggable="false">3</div>
    {#each $gameData.board as card}
        <Card {card} showYear={true} />
    {/each}
</section>
