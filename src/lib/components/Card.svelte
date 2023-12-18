<script lang="ts">
    import type { Card } from '../data'

    export let card: Card
    export let showYear: boolean = false
</script>
<div class="bg-zinc-700 w-64 p-4 mx-auto rounded shadow" draggable="true">
    <h2 class="text-xl font-bold pb-2">{card?.title}</h2>
    {#if showYear}
        <p class="text-center pb-1 font-bold">year: {card?.year}</p>
    {/if}
    <img src={`/images/cards/${card?.image}`} class="w-full rounded" alt={card?.title} />
</div>
