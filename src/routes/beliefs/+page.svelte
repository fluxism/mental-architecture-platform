<script lang="ts">
	let { data } = $props();
	let filter = $state<'all' | 'active' | 'shifting' | 'integrated'>('all');

	let filtered = $derived(
		filter === 'all' ? data.beliefs : data.beliefs.filter((b: any) => b.status === filter)
	);
</script>

<svelte:head>
	<title>Beliefs - MAP</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="font-serif text-3xl text-text-primary">Your Beliefs</h1>
			<p class="mt-1 text-text-secondary">Making the invisible visible</p>
		</div>
		<a
			href="/beliefs/new"
			class="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
		>
			Add Belief
		</a>
	</div>

	<!-- Status filters -->
	<div class="mb-6 flex gap-2">
		{#each ['all', 'active', 'shifting', 'integrated'] as status}
			<button
				onclick={() => filter = status as any}
				class="rounded-full px-3 py-1.5 text-sm transition-colors
					{filter === status ? 'bg-accent text-white' : 'bg-surface-overlay text-text-secondary hover:text-text-primary'}"
			>
				{status.charAt(0).toUpperCase() + status.slice(1)}
				{#if status !== 'all'}
					<span class="ml-1 opacity-60">
						({data.beliefs.filter((b: any) => b.status === status).length})
					</span>
				{/if}
			</button>
		{/each}
	</div>

	{#if data.beliefs.length === 0}
		<div class="rounded-xl border border-border-subtle bg-surface-raised p-12 text-center">
			<p class="font-serif text-xl text-text-secondary">No beliefs identified yet</p>
			<p class="mt-2 text-text-muted">
				Start by journaling, then extract beliefs — or add them directly.
			</p>
			<div class="mt-6 flex justify-center gap-3">
				<a href="/beliefs/new" class="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover">
					Add a Belief
				</a>
				<a href="/journal/new" class="rounded-lg border border-border-medium px-6 py-2.5 text-sm text-text-secondary hover:text-text-primary">
					Write First
				</a>
			</div>
		</div>
	{:else if filtered.length === 0}
		<div class="rounded-xl border border-border-subtle bg-surface-raised p-8 text-center">
			<p class="text-text-secondary">No {filter} beliefs</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each filtered as belief}
				<a
					href="/beliefs/{belief.id}"
					class="block rounded-xl border border-border-subtle bg-surface-raised p-5 transition-colors hover:border-border-medium"
				>
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1">
							<p class="font-serif text-lg text-text-primary">"{belief.statement}"</p>
							{#if belief.functionalBelief}
								<p class="mt-2 text-sm text-status-integrated">&rarr; "{belief.functionalBelief}"</p>
							{/if}
						</div>
						<span class="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium
							{belief.status === 'active' ? 'bg-status-active/20 text-status-active' : ''}
							{belief.status === 'shifting' ? 'bg-status-shifting/20 text-status-shifting' : ''}
							{belief.status === 'integrated' ? 'bg-status-integrated/20 text-status-integrated' : ''}
						">{belief.status}</span>
					</div>
					<time class="mt-3 block text-xs text-text-muted">
						Added {new Date(belief.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
					</time>
				</a>
			{/each}
		</div>
	{/if}
</div>
