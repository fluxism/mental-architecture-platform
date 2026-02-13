<script lang="ts">
	import { enhance } from '$app/forms';
	import PatternText from '$lib/components/PatternText.svelte';

	let { data, form } = $props();
	let editing = $state(false);
	let editContent = $state(data.entry.content as string);
	let showReflectionForm = $state(false);
	let reflectionText = $state('');
	let extracting = $state(false);
	let extractedBeliefs = $state<string[]>([]);

	async function extractBeliefs() {
		extracting = true;
		try {
			const res = await fetch('/api/ai/extract-beliefs', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: data.entry.content })
			});
			const result = await res.json();
			extractedBeliefs = result.beliefs || [];
		} catch {
			extractedBeliefs = [];
		}
		extracting = false;
	}
</script>

<svelte:head>
	<title>Journal Entry - MAP</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<a href="/journal" class="mb-6 inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text-primary">
		&larr; Back to Journal
	</a>

	<div class="mb-2 flex items-center gap-3 text-sm text-text-muted">
		<time>{new Date(data.entry.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</time>
		{#if data.entry.prompt}
			<span class="rounded-full bg-surface-overlay px-2 py-0.5 text-xs">{data.entry.prompt}</span>
		{/if}
	</div>

	<!-- Entry content -->
	{#if editing}
		<form method="POST" action="?/update" use:enhance={() => { return async ({ update }) => { editing = false; await update(); }; }}>
			<textarea
				name="content"
				bind:value={editContent}
				rows="12"
				class="w-full resize-y rounded-xl border border-border-subtle bg-surface-raised p-5 font-serif text-lg leading-relaxed text-text-primary focus:border-accent focus:outline-none"
			></textarea>
			{#if form?.error}
				<p class="mt-2 text-sm text-danger">{form.error}</p>
			{/if}
			<div class="mt-3 flex gap-2">
				<button type="submit" class="rounded-lg bg-accent px-4 py-2 text-sm text-surface hover:bg-accent-hover">Save</button>
				<button type="button" onclick={() => { editing = false; editContent = data.entry.content; }} class="rounded-lg px-4 py-2 text-sm text-text-secondary hover:text-text-primary">Cancel</button>
			</div>
		</form>
	{:else}
		<div class="rounded-xl border border-border-subtle bg-surface-raised p-6">
			<p class="whitespace-pre-wrap font-serif text-lg leading-relaxed text-text-primary">{data.entry.content}</p>
		</div>
		<div class="mt-3 flex gap-2">
			<button onclick={() => editing = true} class="rounded-lg px-3 py-1.5 text-sm text-text-muted transition-colors hover:text-text-primary">Edit</button>
			<form method="POST" action="?/delete" use:enhance={() => { return async ({ update }) => { if (confirm('Delete this entry?')) await update(); }; }}>
				<button type="submit" class="rounded-lg px-3 py-1.5 text-sm text-text-muted transition-colors hover:text-danger">Delete</button>
			</form>
		</div>
	{/if}

	<!-- AI Insights -->
	<div class="mt-8">
		<h2 class="mb-3 font-serif text-xl text-text-primary">Insights</h2>
		{#if data.entry.aiInsights}
			<div class="rounded-xl border border-accent/20 bg-accent/5 p-5">
				<PatternText text={data.entry.aiInsights} class="text-text-secondary italic" />
			</div>
		{/if}
		<form method="POST" action="?/generateInsights" use:enhance class="mt-3">
			<button type="submit" class="rounded-lg bg-surface-overlay px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary">
				{data.entry.aiInsights ? 'Regenerate Insights' : 'Generate AI Insights'}
			</button>
		</form>
	</div>

	<!-- Extract Beliefs -->
	<div class="mt-8">
		<h2 class="mb-3 font-serif text-xl text-text-primary">Hidden Beliefs</h2>
		<p class="mb-3 text-sm text-text-muted">Let AI identify potential limiting beliefs in this entry.</p>

		{#if data.linkedBeliefs.length > 0}
			<div class="mb-4 space-y-2">
				<p class="text-sm text-text-secondary">Linked beliefs:</p>
				{#each data.linkedBeliefs as belief}
					<a href="/beliefs/{belief.id}" class="block rounded-lg border border-border-subtle bg-surface-overlay p-3 text-sm transition-colors hover:border-accent">
						"{belief.statement}"
						<span class="ml-2 rounded-full px-2 py-0.5 text-xs
							{belief.status === 'active' ? 'bg-status-active/20 text-status-active' : ''}
							{belief.status === 'shifting' ? 'bg-status-shifting/20 text-status-shifting' : ''}
							{belief.status === 'integrated' ? 'bg-status-integrated/20 text-status-integrated' : ''}
						">{belief.status}</span>
					</a>
				{/each}
			</div>
		{/if}

		<button
			onclick={extractBeliefs}
			disabled={extracting}
			class="rounded-lg bg-surface-overlay px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary disabled:opacity-50"
		>
			{extracting ? 'Analyzing...' : 'Extract Beliefs from Entry'}
		</button>

		{#if extractedBeliefs.length > 0}
			<div class="mt-4 space-y-2">
				<p class="text-sm text-text-secondary">Detected beliefs:</p>
				{#each extractedBeliefs as belief}
					<div class="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-overlay p-3">
						<span class="text-sm text-text-primary">"{belief}"</span>
						<a href="/beliefs/new?statement={encodeURIComponent(belief)}&entryId={data.entry.id}" class="rounded-lg bg-accent/20 px-3 py-1 text-xs text-accent transition-colors hover:bg-accent/30">
							Add to beliefs
						</a>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Reflections -->
	<div class="mt-8">
		<h2 class="mb-3 font-serif text-xl text-text-primary">Reflections</h2>
		<p class="mb-3 text-sm text-text-muted">Add later insights or notes about this entry.</p>

		{#if data.reflections.length > 0}
			<div class="mb-4 space-y-3">
				{#each data.reflections as reflection}
					<div class="rounded-lg border-l-2 border-warmth/50 bg-surface-overlay p-4">
						<p class="text-sm text-text-primary">{reflection.content}</p>
						<time class="mt-2 block text-xs text-text-muted">
							{new Date(reflection.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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
					rows="4"
					placeholder="What do you notice now, looking back at this entry?"
					class="w-full resize-y rounded-xl border border-border-subtle bg-surface-raised p-4 text-sm text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
				></textarea>
				{#if form?.reflectionError}
					<p class="mt-1 text-sm text-danger">{form.reflectionError}</p>
				{/if}
				<div class="mt-2 flex gap-2">
					<button type="submit" class="rounded-lg bg-warmth px-4 py-2 text-sm text-surface hover:bg-warmth-hover">Add Reflection</button>
					<button type="button" onclick={() => showReflectionForm = false} class="rounded-lg px-4 py-2 text-sm text-text-secondary">Cancel</button>
				</div>
			</form>
		{:else}
			<button onclick={() => showReflectionForm = true} class="rounded-lg bg-surface-overlay px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary">
				Add a Reflection
			</button>
		{/if}
	</div>
</div>
