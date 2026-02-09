<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let generating = $state(false);
	let generatedTitle = $state('');
	let generatedContent = $state('');
	let editingStoryId = $state<string | null>(null);
	let editTitle = $state('');
	let editContent = $state('');

	async function generateStory() {
		generating = true;
		try {
			const res = await fetch('/api/ai/generate-story', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({})
			});
			const result = await res.json();
			generatedTitle = result.title || '';
			generatedContent = result.content || '';
		} catch {
			generatedTitle = '';
			generatedContent = '';
		}
		generating = false;
	}

	function startEdit(story: any) {
		editingStoryId = story.id;
		editTitle = story.title || '';
		editContent = story.content;
	}
</script>

<svelte:head>
	<title>Sacred Parables - MAP</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<a href="/beliefs/{data.belief.id}" class="mb-6 inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text-primary">
		&larr; Back to Belief
	</a>

	<h1 class="font-serif text-3xl text-text-primary">Your Sacred Parables</h1>
	<p class="mt-2 text-text-secondary">
		Stories that speak to your transformation — woven from all your wounds, all your truths.
	</p>

	<!-- Consolidated beliefs overview -->
	{#if data.allBeliefs.length > 0}
		<div class="mt-6 rounded-xl border border-border-subtle bg-surface-raised p-5">
			<p class="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">All beliefs woven into your story</p>
			<div class="space-y-1">
				{#each data.allBeliefs as b}
					<div class="flex items-center gap-2 text-sm">
						<span class="h-1.5 w-1.5 shrink-0 rounded-full
							{b.status === 'active' ? 'bg-text-primary' : ''}
							{b.status === 'shifting' ? 'bg-text-muted' : ''}
							{b.status === 'integrated' ? 'bg-text-secondary' : ''}
						"></span>
						<span class="text-text-secondary">"{b.statement}"</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Existing stories -->
	{#if data.stories.length > 0}
		<div class="mt-8 space-y-6">
			{#each data.stories as story}
				{#if editingStoryId === story.id}
					<form method="POST" action="?/updateStory" use:enhance={() => { return async ({ update }) => { editingStoryId = null; await update(); }; }} class="rounded-xl border border-border-subtle bg-surface-raised p-6">
						<input type="hidden" name="storyId" value={story.id} />
						<input
							name="title"
							bind:value={editTitle}
							placeholder="Story title..."
							class="mb-3 w-full rounded-lg border border-border-subtle bg-surface p-3 font-serif text-xl text-text-primary focus:border-accent focus:outline-none"
						/>
						<textarea
							name="content"
							bind:value={editContent}
							rows="15"
							class="w-full resize-y rounded-lg border border-border-subtle bg-surface p-4 font-serif leading-relaxed text-text-primary focus:border-accent focus:outline-none"
						></textarea>
						<div class="mt-3 flex gap-2">
							<button type="submit" class="rounded-lg bg-accent px-4 py-2 text-sm text-surface">Save</button>
							<button type="button" onclick={() => editingStoryId = null} class="text-sm text-text-secondary">Cancel</button>
						</div>
					</form>
				{:else}
					<div class="rounded-xl border border-border-subtle bg-surface-raised p-8">
						{#if story.title}
							<h2 class="mb-4 font-serif text-2xl text-text-primary">{story.title}</h2>
						{/if}
						<div class="font-serif leading-loose text-text-secondary whitespace-pre-wrap">
							{story.content}
						</div>
						<div class="mt-6 flex items-center justify-between border-t border-border-subtle pt-4">
							<time class="text-xs text-text-muted">
								{new Date(story.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
							</time>
							<div class="flex gap-3">
								<button onclick={() => startEdit(story)} class="text-xs text-text-muted transition-colors hover:text-text-primary">Edit</button>
								<form method="POST" action="?/deleteStory" use:enhance>
									<input type="hidden" name="storyId" value={story.id} />
									<button type="submit" class="text-xs text-text-muted transition-colors hover:text-danger">Delete</button>
								</form>
							</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}

	<!-- Generate new story -->
	<div class="mt-8">
		<h2 class="mb-2 font-serif text-xl text-text-primary">
			{data.stories.length > 0 ? 'Generate Another Parable' : 'Create Your Parable'}
		</h2>
		<p class="mb-4 text-sm text-text-muted">
			The AI will use ALL your beliefs, journal entries, and origin data to craft a deeply personal parable — inspired by the great storytelling traditions of scripture.
		</p>

		<button
			onclick={generateStory}
			disabled={generating}
			class="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-accent-hover disabled:opacity-50"
		>
			{generating ? 'Weaving your parable...' : 'Generate Sacred Parable'}
		</button>

		{#if generatedContent}
			<div class="mt-6 rounded-xl border border-border-subtle bg-surface-raised p-8">
				<p class="mb-2 text-xs font-medium text-text-muted uppercase tracking-wider">Generated Parable</p>
				{#if generatedTitle}
					<h3 class="mb-4 font-serif text-2xl text-text-primary">{generatedTitle}</h3>
				{/if}
				<p class="font-serif leading-loose text-text-secondary whitespace-pre-wrap">{generatedContent}</p>

				<form method="POST" action="?/saveStory" use:enhance={() => { return async ({ update }) => { generatedTitle = ''; generatedContent = ''; await update(); }; }}>
					<input type="hidden" name="title" value={generatedTitle} />
					<input type="hidden" name="content" value={generatedContent} />
					<div class="mt-6 flex gap-3">
						<button type="submit" class="rounded-lg bg-accent px-4 py-2 text-sm text-surface transition-colors hover:bg-accent-hover">
							Save This Parable
						</button>
						<button type="button" onclick={generateStory} class="rounded-lg border border-border-medium px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary">
							Generate Another
						</button>
					</div>
				</form>
			</div>
		{/if}

		{#if form?.error}
			<p class="mt-2 text-sm text-danger">{form.error}</p>
		{/if}
	</div>
</div>
