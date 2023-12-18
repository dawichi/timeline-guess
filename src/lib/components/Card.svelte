<script lang="ts">
    import type { Card } from '../data'

    export let card: Card
    export let showYear: boolean = false
</script>
<div class="bg-zinc-700 w-32 p-4 rounded shadow card draggable cursor-move" draggable="true">
    <h2 class="font-bold pb-2">{card?.title}</h2>
    {#if showYear}
        <p class="text-center pb-1">year: {card?.year}</p>
    {/if}
    <img src={`/images/cards/${card?.image}`} class="w-full rounded" alt={card?.title} />
</div>
