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
gameData.subscribe(data => game = data)

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

// Random code
const board = document.getElementById('board')!
let draggedCard = null;

board.addEventListener('dragstart', (e) => {
    draggedCard = e.target;
    e.dataTransfer!.setData('text/plain', e.target.innerHTML);
    e.target.classList.add('dragging');
});

board.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(board, e.clientY);
    const card = document.querySelector('.dragging');
    if (afterElement == null) {
        board.appendChild(card);
    } else {
        board.insertBefore(card, afterElement);
    }
});

board.addEventListener('dragend', () => {
    draggedCard.classList.remove('dragging');
    draggedCard = null;
});

function getDragAfterElement(container, y) {
    const cards = [...container.querySelectorAll('.card:not(.dragging)')];
    return cards.reduce((closest, card) => {
        const box = card.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: card };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

</script>

<div class="flex pb-40">
    <aside class="w-[400px] min-h-screen">
        <h1 class="text-xl fond-bold text-center p-4">Next Card!</h1>
        {#if $gameData.cardOnHand}
            <Card card={$gameData.cardOnHand} />
        {/if}
    </aside>

    <aside class="flex flex-wrap min-h-screen w-full justify-center items-start p-4">
        <!-- <button class="bg-zinc-800 hover:bg-zinc-700 h-16 w-16 rounded-lg">
            <i class="bi bi-plus-square-dotted"></i>
        </button> -->
        <ul id="board">
            {#each $gameData.board as card}
                <Card {card} showYear={true} />
                <!-- <button class="bg-zinc-800 hover:bg-zinc-700 h-16 w-16 rounded-lg">
                    <i class="bi bi-plus-square-dotted"></i>
                </button> -->
            {/each}
        </ul>
    </aside>
</div>
