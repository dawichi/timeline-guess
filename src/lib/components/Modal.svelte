<!--
  @component
  ## ModalGame
  used to display info inside a HTML5 dialog
-->
<script lang="ts">
    import { gameData, initial_data, type GameData } from '$lib/context/game'

    const modal = {
        // Element.showModal() is still not noted in TS lib definitions
        open: () => {
            if (!document?.querySelector('[data-modal-game]')) return
            ;(document?.querySelector('[data-modal-game]') as any).showModal()
        },
        close: () => {
            if (!document?.querySelector('[data-modal-game]')) return
            ;(document?.querySelector('[data-modal-game]') as any).close()
        },
    }

    // This memo the state to prevent multiple calls
    let type: GameData['modal'] = null
    $: gameData.subscribe(data => {
        // Skip re-render if the value is the same
        if (data.modal === type) return

        // Update the memo and run the logic
        type = data.modal
        data.modal !== null ? modal.open() : modal.close()
    })
</script>

<dialog data-modal-game class="relative rounded bg-zinc-900 p-2 text-white shadow-lg shadow-zinc-700">
    <div class="relative bg-zinc-900 p-1">
        <h2 class="text-2xl font-bold mb-4">
            <i class="bi bi-emoji-frown-fill"></i> Oh no!
        </h2>
        <button
            class="h-6 w-6 border border-zinc-500 bg-zinc-700 text-white hover:border-red-500 hover:bg-red-500 absolute top-2 right-2"
            on:click={() => gameData.update(data => initial_data)}>
            <i class="bi bi-x-lg" />
        </button>
        <p>You missed that last one...</p>
        <p>Your final score was <span class="font-bold text-green-600">17</span>!</p>
        <p>Better luck next time!</p>
    </div>
</dialog>

<style>
    dialog::backdrop {
        background-color: rgba(12, 12, 12, 0.5);
        /* From https://css.glass */
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(8.7px);
        -webkit-backdrop-filter: blur(8.7px);
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
</style>
