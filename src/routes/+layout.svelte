<script lang="ts">
    import '../app.css'
</script>

<div class="bg-zinc-900 text-white min-h-screen">
    <header class='shadow-smbg-zinc-900 sticky top-0 z-10 border-b border-zinc-700'>
        <nav class='flex items-center justify-between px-4'>
            <a href='https://dawichi.dev' target='_blank' rel='noopener noreferrer' class='p-1 font-bold hover:text-teal-400'>by dawichi</a>
            <a href='/' class='p-1 font-bold hover:text-teal-400'>Timeline Guess</a>
            <div class='flex items-center justify-center gap-4'>
                <a
                    title='Github link'
                    href='https://github.com/dawichi'
                    target='_blank'
                    rel='noopener noreferrer'
                    class='flex items-center justify-center p-1 font-bold hover:text-teal-400'
                >
                    <i class='bi bi-github text-2xl'></i>
                </a>
            </div>
        </nav>
        <div id='post-progress-bar' class='h-1 w-0 rounded-r bg-teal-500'></div>
    </header>

    <main class="mt-10 px-2">
        <slot />
    </main>
</div>
