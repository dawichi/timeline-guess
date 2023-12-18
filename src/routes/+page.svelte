<script lang="ts">
    import Card from '$lib/components/Card.svelte'
    import Modal from '$lib/components/Modal.svelte'
    import { gameData, initial_data, type GameData } from '$lib/context/game'
    import { onMount } from 'svelte'

    // Game is needed because you cannot use $gameData directly in the script
    let game: GameData = {
        deck: [],
        cards_copy: [],
        board: [],
        hand: [],
        modal: null,
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

    // Delete all event listeners from the cards and containers
    function cleanEventListeners() {
        const draggables = document.querySelectorAll('.draggable')
        const containers = document.querySelectorAll('.draggable-box')

        draggables.forEach(draggable => {
            const new_element = draggable.cloneNode(true)
            draggable.parentNode!.replaceChild(new_element, draggable)
        })

        containers.forEach(container => {
            const new_element = container.cloneNode(true)
            container.parentNode!.replaceChild(new_element, container)
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

        if (cards.length <= 1) return
        
        // Get the dates for each card      
        cards.forEach(card => {
            if (card.querySelector('p')!.textContent === '?') {
                const card_data = game.cards_copy.find(c => c.title === card.querySelector('h2')!.textContent!)
                card.querySelector('p')!.textContent = String(card_data!.year) 
            }
        })

        cards.map(card => Number(card.querySelector('p')!.textContent!))
        const result = cards.reduce((prev: any, curr: any) => {
            if (Number(prev.querySelector('p')!.textContent!) > Number(curr.querySelector('p')!.textContent!)) {
                // The cards are not sorted correctly
                gameData.update(data => initial_data)
            } else {
                // The cards are sorted correctly
                return curr
            }
        })
    }

    onMount(() => {
        startGame() 
        // alert('Drag the cards from your hand to the board, sorting them by date! \n Try to get the highest score possible!')

        // Wait 2s, so the cards are rendered
        setTimeout(() => {
            // Assign the event listeners
            assignEventListeners()
        }, 200)
    })
    const styles = {
        base: 'text-2xl font-bold card p-4 rounded bg-zinc-500 w-24 h-24 flex items-center justify-center',
    }
</script>

<p>
    In this game, you need to sort the cards in the board by date. If you miss, you lose.
</p>

<!-- Here the cards will appear, you can sort them freely -->
<h1 class="font-bold my-4">PLAYER'S HAND</h1>
<section id="hand" class="draggable-box bg-zinc-800 p-8 flex gap-4 overflow-x-auto">
    <!-- <div class="{styles.base} draggable cursor-move" draggable="true">1</div>
    <div class="{styles.base} draggable cursor-move" draggable="true">2</div>
    <div class="{styles.base} draggable cursor-move" draggable="true">4</div>
    <div class="{styles.base} draggable cursor-move" draggable="true">5</div> -->

    {#each $gameData.hand as card}
        <Card {card} showYear={false} />
    {/each}
</section>

<!-- Here you need to place the cards sorted to gain points -->
<h1 class="font-bold my-4">BOARD</h1>
<section id="board" class="draggable-box bg-zinc-800 p-8 flex gap-4 overflow-x-auto">
    <!-- <div class="{styles.base} text-black" draggable="false">3</div> -->
    {#each $gameData.board as card}
        <Card {card} showYear={true} />
    {/each}
</section>

<button on:click={() => gameData.update(data => ({ ...data, modal: 'game over' }))}>almendra</button>

<Modal />
