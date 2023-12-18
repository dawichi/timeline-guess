<script lang="ts">
    import type { Card } from '../data'
    import Image from './Image.svelte'

    export let card: Card
    export let showYear: boolean = false
</script>

<div
    class="bg-zinc-700 w-42 h-full p-2 rounded shadow card draggable cursor-move flex flex-col items-center justify-center"
    draggable="true"
>
    <h2 class="font-bold pb-2">{card?.title}</h2>
    <div class="w-32 h-32">
        <Image src="/images/cards/{card?.image}" />
    </div>
    <p class="text-center font-bold pt-1">{showYear ? card?.year : '?'}</p>
</div>
