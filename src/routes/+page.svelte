<script lang="ts">
    import Card from '$lib/components/Card.svelte'
    import { gameData, type GameData } from '$lib/game'
    import { onMount } from 'svelte'

    // Game is needed because you cannot use $gameData directly in the script
    let game: GameData = {
        deck: [],
        cards_copy: [],
        board: [],
        cardOnHand: null,
    }
    gameData.subscribe(data => (game = data))

    onMount(startGame)

    /**
     * Start the game
     */
    function startGame(): void {
        pickCardFromDeck()
        placeItOnBoard()
        pickCardFromDeck()
        placeItOnBoard()
        pickCardFromDeck()
        placeItOnBoard()
        pickCardFromDeck()
        placeItOnBoard()
        pickCardFromDeck()
    }
    // ------------------------------------
    //                UTILS
    // ------------------------------------
    function pickCardFromDeck() {
        // Pick a random card from the deck
        const index = Math.floor(Math.random() * game.deck.length)

        // Move the card from the deck to the hand
        gameData.update(data => {
            data.cardOnHand = data.deck[index]!
            data.deck.splice(index, 1)
            return data
        })
    }

    function placeItOnBoard() {
        // Place the card from your hand on the board
        gameData.update(data => {
            data.board.push(data.cardOnHand!)
            data.cardOnHand = null
            return data
        })
    }

    // https://www.youtube.com/watch?v=jfYWwQrtzzY
    onMount(() => {
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

        // Allow to place the card between two specific cards inside the container
        function getDragAfterElement(container: HTMLElement, x: number): Element | undefined {
            // Get all draggable elements except the one that is being dragged
            const cards = [...container.querySelectorAll('.card:not(.dragging)')]

            return cards.reduce(
                (closest, nextChild) => {
                    const box = nextChild.getBoundingClientRect()
                    const offset = x - box.left - box.width / 2

                    // If the offset is negative, it means that the card is above the middle of the card
                    // If the offset is positive, it means that the card is below the middle of the card
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
            console.log('validating...')
            const cards = [...document.getElementById('board')!.querySelectorAll('.card')!]
        }
    })

    const styles = {
        base: 'text-2xl font-bold card p-4 rounded bg-zinc-500 w-24 h-24 flex items-center justify-center'
    }
</script>

<!-- <div class="flex pb-40">
    <aside class="w-[400px] min-h-screen">
        <h1 class="text-xl fond-bold text-center p-4">Next Card!</h1>
        {#if $gameData.cardOnHand}
            <Card card={$gameData.cardOnHand} />
        {/if}
    </aside>

    <aside class="flex flex-wrap min-h-screen w-full justify-center items-start p-4">
        <ul id="board">
            {#each $gameData.board as card}
                <Card {card} showYear={true} />
            {/each}
        </ul>
    </aside>
</div> -->

<h1 class="font-bold my-4">PLAYER'S HAND</h1>
<div id="hand" class="draggable-box bg-zinc-700 p-8 flex flex-wrap gap-4">
    <div class="{styles.base} draggable cursor-move" draggable="true">1</div>
    <div class="{styles.base} draggable cursor-move" draggable="true">2</div>
    <div class="{styles.base} draggable cursor-move" draggable="true">4</div>
    <div class="{styles.base} draggable cursor-move" draggable="true">5</div>
</div>

<h1 class="font-bold my-4">BOARD</h1>
<div id="board" class="draggable-box bg-zinc-700 p-8">
    <div class="{styles.base}" draggable="false">3</div>
</div>
