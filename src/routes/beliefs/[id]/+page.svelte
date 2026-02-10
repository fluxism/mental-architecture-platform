<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let editingStatement = $state(false);
	let statementText = $state(data.belief.statement as string);
	let showReflectionForm = $state(false);
	let reflectionText = $state('');
</script>

<svelte:head>
	<title>Belief - MAP</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<a href="/beliefs" class="mb-6 inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text-primary">
		&larr; Back to Beliefs
	</a>

	<!-- Belief header -->
	<div class="rounded-xl border border-border-subtle bg-surface-raised p-6">
		{#if editingStatement}
			<form method="POST" action="?/updateStatement" use:enhance={() => { return async ({ update }) => { editingStatement = false; await update(); }; }}>
				<textarea
					name="statement"
					bind:value={statementText}
					rows="2"
					class="w-full resize-y rounded-lg border border-border-subtle bg-surface p-3 font-serif text-xl text-text-primary focus:border-accent focus:outline-none"
				></textarea>
				<div class="mt-2 flex gap-2">
					<button type="submit" class="rounded-lg bg-accent px-3 py-1.5 text-sm text-white">Save</button>
					<button type="button" onclick={() => { editingStatement = false; statementText = data.belief.statement; }} class="text-sm text-text-secondary">Cancel</button>
				</div>
			</form>
		{:else}
			<div class="flex items-start justify-between gap-4">
				<button onclick={() => editingStatement = true} class="text-left">
					<p class="font-serif text-2xl text-text-primary">"{data.belief.statement}"</p>
				</button>
				<span class="shrink-0 rounded-full px-3 py-1 text-sm font-medium
					{data.belief.status === 'active' ? 'bg-status-active/20 text-status-active' : ''}
					{data.belief.status === 'shifting' ? 'bg-status-shifting/20 text-status-shifting' : ''}
					{data.belief.status === 'integrated' ? 'bg-status-integrated/20 text-status-integrated' : ''}
				">{data.belief.status}</span>
			</div>
		{/if}

		{#if data.belief.functionalBelief}
			<p class="mt-4 border-l-2 border-status-integrated/50 pl-4 text-status-integrated">
				&rarr; "{data.belief.functionalBelief}"
			</p>
		{/if}

		<!-- Status changer -->
		<div class="mt-4 flex items-center gap-2">
			<span class="text-xs text-text-muted">Status:</span>
			{#each ['active', 'shifting', 'integrated'] as status}
				<form method="POST" action="?/updateStatus" use:enhance class="inline">
					<input type="hidden" name="status" value={status} />
					<button
						type="submit"
						class="rounded-full px-2.5 py-1 text-xs transition-colors
							{data.belief.status === status ? 'font-medium' : 'opacity-50 hover:opacity-80'}
							{status === 'active' ? 'bg-status-active/20 text-status-active' : ''}
							{status === 'shifting' ? 'bg-status-shifting/20 text-status-shifting' : ''}
							{status === 'integrated' ? 'bg-status-integrated/20 text-status-integrated' : ''}
						"
					>
						{status}
					</button>
				</form>
			{/each}
		</div>

		<div class="mt-4 flex gap-4 border-t border-border-subtle pt-4 text-sm">
			<form method="POST" action="?/delete" use:enhance={() => { return async ({ update }) => { if (confirm('Delete this belief and all associated data?')) await update(); }; }}>
				<button type="submit" class="text-text-muted transition-colors hover:text-danger">Delete belief</button>
			</form>
		</div>
	</div>

	<!-- Navigation tabs -->
	<div class="mt-8 flex gap-1 rounded-lg bg-surface-overlay p-1">
		<a href="/beliefs/{data.belief.id}/origin" class="flex-1 rounded-md px-4 py-2.5 text-center text-sm transition-colors hover:bg-surface-raised
			{data.origins.length > 0 ? 'text-text-primary' : 'text-text-muted'}">
			Origin Inquiry
			{#if data.origins.length > 0}
				<span class="ml-1 text-xs text-accent">({data.origins.length})</span>
			{/if}
		</a>
		<a href="/beliefs/{data.belief.id}/transform" class="flex-1 rounded-md px-4 py-2.5 text-center text-sm transition-colors hover:bg-surface-raised
			{data.affirmations.length > 0 ? 'text-text-primary' : 'text-text-muted'}">
			Transform
			{#if data.affirmations.length > 0}
				<span class="ml-1 text-xs text-accent">({data.affirmations.length})</span>
			{/if}
		</a>
		<a href="/beliefs/{data.belief.id}/story" class="flex-1 rounded-md px-4 py-2.5 text-center text-sm transition-colors hover:bg-surface-raised
			{data.stories.length > 0 ? 'text-text-primary' : 'text-text-muted'}">
			Mythic Story
			{#if data.stories.length > 0}
				<span class="ml-1 text-xs text-accent">({data.stories.length})</span>
			{/if}
		</a>
	</div>

	<!-- Quick overview -->
	{#if data.origins.length > 0}
		<div class="mt-6">
			<h3 class="mb-2 text-sm font-medium text-text-secondary">Origin Responses</h3>
			<div class="space-y-2">
				{#each data.origins.slice(0, 3) as origin}
					<div class="rounded-lg bg-surface-overlay p-3">
						<p class="text-xs text-text-muted">{origin.question}</p>
						<p class="mt-1 text-sm text-text-primary">{origin.response}</p>
					</div>
				{/each}
				{#if data.origins.length > 3}
					<a href="/beliefs/{data.belief.id}/origin" class="text-sm text-accent hover:text-accent-hover">
						View all {data.origins.length} responses &rarr;
					</a>
				{/if}
			</div>
		</div>
	{/if}

	{#if data.affirmations.length > 0}
		<div class="mt-6">
			<h3 class="mb-2 text-sm font-medium text-text-secondary">Affirmations</h3>
			{#each data.affirmations.slice(0, 2) as affirmation}
				<div class="rounded-lg border border-accent/20 bg-accent/5 p-4">
					<p class="font-serif text-text-primary italic">{affirmation.content}</p>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Reflections -->
	<div class="mt-8">
		<h3 class="mb-3 text-sm font-medium text-text-secondary">Reflections</h3>
		{#if data.reflections.length > 0}
			<div class="mb-4 space-y-3">
				{#each data.reflections as reflection}
					<div class="rounded-lg border-l-2 border-warmth/50 bg-surface-overlay p-4">
						<p class="text-sm text-text-primary">{reflection.content}</p>
						<time class="mt-2 block text-xs text-text-muted">
							{new Date(reflection.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(reflection.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
						</time>
					</div>
				{/each}
			</div>
		{/if}

		{#if showReflectionForm}
			<form method="POST" action="?/addReflection" use:enhance={() => { return async ({ update }) => { showReflectionForm = false; reflectionText = ''; await update(); }; }}>
				<textarea
					name="content"
					bind:value={reflectionText}
					rows="3"
					placeholder="What do you notice about this belief now?"
					class="w-full rounded-xl border border-border-subtle bg-surface-raised p-4 text-sm text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
				></textarea>
				<div class="mt-2 flex gap-2">
					<button type="submit" class="rounded-lg bg-warmth px-4 py-2 text-sm text-white hover:bg-warmth-hover">Add Reflection</button>
					<button type="button" onclick={() => showReflectionForm = false} class="text-sm text-text-secondary">Cancel</button>
				</div>
			</form>
		{:else}
			<button onclick={() => showReflectionForm = true} class="rounded-lg bg-surface-overlay px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary">
				Add a Reflection
			</button>
		{/if}
	</div>
</div>
