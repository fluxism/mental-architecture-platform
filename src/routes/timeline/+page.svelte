<script lang="ts">
	let { data } = $props();

	const typeConfig: Record<string, { color: string; icon: string; link: (e: any) => string }> = {
		journal: { color: 'text-accent', icon: 'J', link: (e: any) => `/journal/${e.id}` },
		belief: { color: 'text-warmth', icon: 'B', link: (e: any) => `/beliefs/${e.id}` },
		affirmation: { color: 'text-status-integrated', icon: 'A', link: (e: any) => `/beliefs/${e.linkedId}` },
		story: { color: 'text-status-shifting', icon: 'S', link: (e: any) => `/beliefs/${e.linkedId}` },
		reflection: { color: 'text-text-secondary', icon: 'R', link: (e: any) => e.linkedId ? `/beliefs/${e.linkedId}` : '#' }
	};
</script>

<svelte:head>
	<title>Timeline - MAP</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<h1 class="font-serif text-3xl text-text-primary">Your Timeline</h1>
	<p class="mt-1 text-text-secondary">A record of your inner journey</p>

	{#if data.events.length === 0}
		<div class="mt-8 rounded-xl border border-border-subtle bg-surface-raised p-12 text-center">
			<p class="font-serif text-xl text-text-secondary">Your story hasn't begun yet</p>
			<p class="mt-2 text-text-muted">Start with a journal entry or add a belief to see your timeline grow.</p>
			<div class="mt-6 flex justify-center gap-3">
				<a href="/journal/new" class="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover">Write an Entry</a>
				<a href="/beliefs/new" class="rounded-lg border border-border-medium px-6 py-2.5 text-sm text-text-secondary hover:text-text-primary">Add a Belief</a>
			</div>
		</div>
	{:else}
		<div class="mt-8">
			<!-- Timeline line -->
			<div class="relative">
				<div class="absolute left-5 top-0 bottom-0 w-px bg-border-subtle"></div>

				<div class="space-y-4">
					{#each data.events as event}
						{@const config = typeConfig[event.type]}
						<a href={config.link(event)} class="group relative ml-12 block rounded-xl border border-border-subtle bg-surface-raised p-4 transition-colors hover:border-border-medium">
							<!-- Timeline dot -->
							<div class="absolute -left-[1.9rem] top-5 flex h-6 w-6 items-center justify-center rounded-full bg-surface-overlay text-xs font-bold {config.color}">
								{config.icon}
							</div>

							<div class="flex items-start justify-between gap-3">
								<div class="flex-1">
									<p class="text-sm font-medium {config.color}">{event.title}</p>
									<p class="mt-1 text-sm text-text-primary line-clamp-2">{event.preview}</p>
								</div>
								{#if event.status}
									<span class="shrink-0 rounded-full px-2 py-0.5 text-xs
										{event.status === 'active' ? 'bg-status-active/20 text-status-active' : ''}
										{event.status === 'shifting' ? 'bg-status-shifting/20 text-status-shifting' : ''}
										{event.status === 'integrated' ? 'bg-status-integrated/20 text-status-integrated' : ''}
									">{event.status}</span>
								{/if}
							</div>

							<time class="mt-2 block text-xs text-text-muted">
								{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(event.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
							</time>
						</a>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
