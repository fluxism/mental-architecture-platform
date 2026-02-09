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
				body: JSON.stringify({
					belief: data.belief.statement,
					origins: data.origins.map((o: any) => ({ question: o.question, response: o.response })),
					functionalBelief: data.belief.functionalBelief || undefined
				})
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
	<title>Mythic Story - MAP</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<a href="/beliefs/{data.belief.id}" class="mb-6 inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text-primary">
		&larr; Back to Belief
	</a>

	<h1 class="font-serif text-3xl text-text-primary">Your Mythic Story</h1>
	<p class="mt-2 text-text-secondary">
		A symbolic narrative for: <span class="text-warmth italic">"{data.belief.statement}"</span>
	</p>
	<p class="mt-1 text-sm text-text-muted">
		Stories speak to the subconscious. They reframe who you are through myth, metaphor, and transformation.
	</p>

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
							<button type="submit" class="rounded-lg bg-accent px-4 py-2 text-sm text-white">Save</button>
							<button type="button" onclick={() => editingStoryId = null} class="text-sm text-text-secondary">Cancel</button>
						</div>
					</form>
				{:else}
					<div class="rounded-xl border border-border-subtle bg-surface-raised p-8">
						{#if story.title}
							<h2 class="mb-4 font-serif text-2xl text-warmth">{story.title}</h2>
						{/if}
						<div class="font-serif leading-loose text-text-primary whitespace-pre-wrap">
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
		<h2 class="mb-4 font-serif text-xl text-text-primary">
			{data.stories.length > 0 ? 'Generate Another Story' : 'Create Your Story'}
		</h2>

		{#if data.origins.length === 0}
			<div class="mb-4 rounded-xl border border-warmth/30 bg-warmth/5 p-5">
				<p class="text-sm text-text-secondary">
					Stories are richer when they draw from your origin inquiry.
					<a href="/beliefs/{data.belief.id}/origin" class="text-accent hover:text-accent-hover">Explore origins first</a> for a more personalized narrative.
				</p>
			</div>
		{/if}

		<button
			onclick={generateStory}
			disabled={generating}
			class="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
		>
			{generating ? 'Weaving your story...' : 'Generate Mythic Story'}
		</button>

		{#if generatedContent}
			<div class="mt-6 rounded-xl border border-accent/20 bg-surface-raised p-6">
				<p class="mb-2 text-xs font-medium text-accent">Generated Story</p>
				{#if generatedTitle}
					<h3 class="mb-3 font-serif text-xl text-warmth">{generatedTitle}</h3>
				{/if}
				<p class="font-serif leading-loose text-text-primary whitespace-pre-wrap">{generatedContent}</p>

				<form method="POST" action="?/saveStory" use:enhance={() => { return async ({ update }) => { generatedTitle = ''; generatedContent = ''; await update(); }; }}>
					<input type="hidden" name="title" value={generatedTitle} />
					<input type="hidden" name="content" value={generatedContent} />
					<div class="mt-4 flex gap-3">
						<button type="submit" class="rounded-lg bg-warmth px-4 py-2 text-sm text-white transition-colors hover:bg-warmth-hover">
							Save This Story
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
