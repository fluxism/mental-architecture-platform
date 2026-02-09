<script lang="ts">
	let { data } = $props();

	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		}).format(new Date(date));
	}

	function truncate(text: string, length: number = 120): string {
		if (text.length <= length) return text;
		return text.slice(0, length).trimEnd() + '...';
	}
</script>

<svelte:head>
	<title>Dashboard - BibleBabble</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-6 py-10">
	<!-- Welcome -->
	<div class="mb-10">
		<h1 class="font-serif text-2xl text-text-primary">
			Welcome back{data.user?.name ? `, ${data.user.name}` : ''}
		</h1>
		<p class="mt-1 text-sm text-text-muted">Your inner landscape, at a glance.</p>
	</div>

	<!-- Stats -->
	<div class="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
		<div class="rounded-lg border border-border-subtle bg-surface-raised p-4">
			<div class="text-2xl font-light text-text-primary">{data.totalEntries}</div>
			<div class="mt-1 text-xs text-text-muted">Journal Entries</div>
		</div>

		<div class="rounded-lg border border-border-subtle bg-surface-raised p-4">
			<div class="flex items-baseline gap-1.5">
				<span class="text-2xl font-light text-status-active">{data.beliefCounts.active}</span>
			</div>
			<div class="mt-1 text-xs text-text-muted">Active Beliefs</div>
		</div>

		<div class="rounded-lg border border-border-subtle bg-surface-raised p-4">
			<div class="flex items-baseline gap-1.5">
				<span class="text-2xl font-light text-status-shifting">{data.beliefCounts.shifting}</span>
			</div>
			<div class="mt-1 text-xs text-text-muted">Shifting</div>
		</div>

		<div class="rounded-lg border border-border-subtle bg-surface-raised p-4">
			<div class="flex items-baseline gap-1.5">
				<span class="text-2xl font-light text-status-integrated">{data.beliefCounts.integrated}</span>
			</div>
			<div class="mt-1 text-xs text-text-muted">Integrated</div>
		</div>
	</div>

	<div class="grid gap-8 lg:grid-cols-3">
		<!-- Recent Entries -->
		<div class="lg:col-span-2">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="font-serif text-lg text-text-primary">Recent Entries</h2>
				<a
					href="/journal"
					class="text-xs text-text-muted transition-colors hover:text-accent"
				>
					View all
				</a>
			</div>

			{#if data.recentEntries.length === 0}
				<div class="rounded-lg border border-border-subtle bg-surface-raised p-8 text-center">
					<p class="text-sm text-text-secondary">No journal entries yet.</p>
					<p class="mt-2 text-xs text-text-muted">
						Begin writing to explore and surface your beliefs.
					</p>
					<a
						href="/journal/new"
						class="mt-5 inline-flex items-center rounded-md border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/20 hover:text-accent-hover"
					>
						Write your first entry
					</a>
				</div>
			{:else}
				<div class="space-y-2">
					{#each data.recentEntries as entry}
						<a
							href="/journal/{entry.id}"
							class="group block rounded-lg border border-border-subtle bg-surface-raised p-4 transition-all duration-150 hover:border-border-medium hover:bg-surface-overlay"
						>
							{#if entry.prompt}
								<div class="mb-1.5 text-xs font-medium text-accent/70 italic">
									{truncate(entry.prompt, 80)}
								</div>
							{/if}
							<p class="text-sm leading-relaxed text-text-secondary group-hover:text-text-primary">
								{truncate(entry.content)}
							</p>
							<div class="mt-2 text-xs text-text-muted">
								{formatDate(entry.createdAt)}
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Quick Actions -->
		<div>
			<h2 class="mb-4 font-serif text-lg text-text-primary">Quick Actions</h2>

			<div class="space-y-2">
				<a
					href="/journal/new"
					class="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-raised p-4 transition-all duration-150 hover:border-accent/30 hover:bg-surface-overlay"
				>
					<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
						</svg>
					</div>
					<div>
						<div class="text-sm text-text-primary">New Entry</div>
						<div class="text-xs text-text-muted">Write and reflect</div>
					</div>
				</a>

				<a
					href="/beliefs/new"
					class="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-raised p-4 transition-all duration-150 hover:border-warmth/30 hover:bg-surface-overlay"
				>
					<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-warmth/15 text-warmth">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
					</div>
					<div>
						<div class="text-sm text-text-primary">Add Belief</div>
						<div class="text-xs text-text-muted">Name what you carry</div>
					</div>
				</a>

				<a
					href="/timeline"
					class="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-raised p-4 transition-all duration-150 hover:border-status-integrated/30 hover:bg-surface-overlay"
				>
					<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-status-integrated/15 text-status-integrated">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
						</svg>
					</div>
					<div>
						<div class="text-sm text-text-primary">View Timeline</div>
						<div class="text-xs text-text-muted">See your evolution</div>
					</div>
				</a>
			</div>

			<!-- Belief summary if user has beliefs -->
			{#if data.totalBeliefs > 0}
				<div class="mt-6 rounded-lg border border-border-subtle bg-surface-raised p-4">
					<h3 class="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Belief Overview</h3>
					<div class="space-y-2">
						{#if data.beliefCounts.active > 0}
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div class="h-2 w-2 rounded-full bg-status-active"></div>
									<span class="text-xs text-text-secondary">Active</span>
								</div>
								<span class="text-xs text-text-muted">{data.beliefCounts.active}</span>
							</div>
						{/if}
						{#if data.beliefCounts.shifting > 0}
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div class="h-2 w-2 rounded-full bg-status-shifting"></div>
									<span class="text-xs text-text-secondary">Shifting</span>
								</div>
								<span class="text-xs text-text-muted">{data.beliefCounts.shifting}</span>
							</div>
						{/if}
						{#if data.beliefCounts.integrated > 0}
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div class="h-2 w-2 rounded-full bg-status-integrated"></div>
									<span class="text-xs text-text-secondary">Integrated</span>
								</div>
								<span class="text-xs text-text-muted">{data.beliefCounts.integrated}</span>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
