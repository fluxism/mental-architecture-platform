<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Journal - BibleBabble</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="font-serif text-3xl text-text-primary">Your Journal</h1>
			<p class="mt-1 text-text-secondary">A safe space for honest expression</p>
		</div>
		<a
			href="/journal/new"
			class="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
		>
			New Entry
		</a>
	</div>

	{#if data.entries.length === 0}
		<div class="rounded-xl border border-border-subtle bg-surface-raised p-12 text-center">
			<p class="font-serif text-xl text-text-secondary">No entries yet</p>
			<p class="mt-2 text-text-muted">
				Begin by writing what feels heavy, what keeps repeating, or what you need to say.
			</p>
			<a
				href="/journal/new"
				class="mt-6 inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
			>
				Write Your First Entry
			</a>
		</div>
	{:else}
		<div class="space-y-4">
			{#each data.entries as entry}
				<a
					href="/journal/{entry.id}"
					class="block rounded-xl border border-border-subtle bg-surface-raised p-5 transition-colors hover:border-border-medium"
				>
					<p class="line-clamp-3 text-text-primary">
						{entry.content}
					</p>
					<div class="mt-3 flex items-center gap-3 text-sm text-text-muted">
						<time>{new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
						{#if entry.prompt}
							<span class="rounded-full bg-surface-overlay px-2 py-0.5 text-xs">
								{entry.prompt}
							</span>
						{/if}
						{#if entry.aiInsights}
							<span class="text-accent">has insights</span>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
