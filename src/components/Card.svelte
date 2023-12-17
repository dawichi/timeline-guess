<script lang="ts">
    export let title: string
    export let year: string
    export let image: string
</script>
<div class="bg-zinc-700 w-80 p-4 mx-auto rounded shadow">
    <h2 class="text-xl font-bold">{String(title)}</h2>
    <p>{String(year)}</p>
    <img src={`/images/cards/${image}`} class="w-full rounded" alt={title} />
</div>
