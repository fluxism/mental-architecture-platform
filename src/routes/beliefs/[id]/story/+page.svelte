<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let generating = $state(false);
	let generatedTitle = $state('');
	let generatedContent = $state('');
	let editingStoryId = $state<string | null>(null);
	let editTitle = $state('');
	let editContent = $state('');
	let errorMessage = $state('');

	async function generateStory() {
		generating = true;
		errorMessage = '';
		generatedTitle = '';
		generatedContent = '';
		try {
			const res = await fetch('/api/ai/generate-story', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({})
			});
			if (!res.ok) {
				const err = await res.text().catch(() => null);
				let msg = 'Generation failed';
				if (err) try { msg = JSON.parse(err).message || msg; } catch {}
				throw new Error(msg);
			}
			const text = await res.text();
			try {
				const result = JSON.parse(text);
				generatedTitle = result.title || '';
				generatedContent = result.content || '';
			} catch {
				generatedContent = text;
			}
			if (!generatedContent) {
				errorMessage = 'The story came back empty. Please try again.';
			}
		} catch (e: any) {
			errorMessage = e?.message || 'Could not generate right now. Please try again.';
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
		Stories woven from your wounds and truths — deeply personal, deeply yours.
	</p>

	<!-- Consolidated beliefs overview -->
	{#if data.allBeliefs.length > 0}
		<div class="mt-6 rounded-xl border border-border-subtle bg-surface-raised p-5">
			<p class="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Your beliefs woven into this story</p>
			<div class="space-y-1">
				{#each data.allBeliefs as b}
					<div class="flex items-center gap-2 text-sm">
						<span class="h-1.5 w-1.5 shrink-0 rounded-full
							{b.id === data.belief.id ? 'bg-accent' : ''}
							{b.id !== data.belief.id && b.status === 'active' ? 'bg-text-primary' : ''}
							{b.id !== data.belief.id && b.status === 'shifting' ? 'bg-text-muted' : ''}
							{b.id !== data.belief.id && b.status === 'integrated' ? 'bg-text-secondary' : ''}
						"></span>
						<span class="{b.id === data.belief.id ? 'text-accent font-medium' : 'text-text-secondary'}">
							"{b.statement}"
						</span>
						{#if b.id === data.belief.id}
							<span class="text-xs text-accent">(current)</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Generate new story — PROMINENT CTA -->
	{#if !generating && !generatedContent}
		<div class="mt-8 rounded-xl border-2 border-accent/40 bg-accent/5 p-8 text-center">
			<h2 class="font-serif text-xl text-text-primary">
				{data.stories.length > 0 ? 'Generate Another Parable' : 'Create Your Parable'}
			</h2>
			<p class="mx-auto mt-2 max-w-md text-sm text-text-secondary">
				The AI will read everything you've written — your beliefs, journal entries, and origin work — to craft a parable that speaks to your journey.
			</p>

			{#if errorMessage}
				<div class="mx-auto mt-4 max-w-md rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
					{errorMessage}
				</div>
			{/if}

			<button
				onclick={generateStory}
				class="mt-6 rounded-lg bg-accent px-8 py-3.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-accent-hover hover:shadow-md"
			>
				Generate Sacred Parable
			</button>
		</div>
	{/if}

	<!-- Loading state with brain animation -->
	{#if generating}
		<div class="mt-8 rounded-xl border border-border-subtle bg-surface-raised p-12 text-center">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
				<svg class="h-12 w-12 animate-spin text-accent" viewBox="0 0 64 64" fill="none" style="animation-duration: 3s;">
					<!-- Brain outline -->
					<path d="M32 8c-6 0-11 3-14 7-2 3-3 6-3 10 0 2 0 4 1 6-2 1-4 3-5 6-1 3-1 5 0 8 1 2 3 4 5 5 1 3 3 5 6 7 3 2 7 3 10 3s7-1 10-3c3-2 5-4 6-7 2-1 4-3 5-5 1-3 1-5 0-8-1-3-3-5-5-6 1-2 1-4 1-6 0-4-1-7-3-10-3-4-8-7-14-7z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
					<!-- Center line -->
					<path d="M32 15v34" stroke="currentColor" stroke-width="1.5" opacity="0.5" />
					<!-- Left curves -->
					<path d="M32 22c-4 0-8 2-10 5M32 32c-5 0-9 2-11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4" />
					<!-- Right curves -->
					<path d="M32 22c4 0 8 2 10 5M32 32c5 0 9 2 11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4" />
				</svg>
			</div>
			<p class="font-serif text-lg text-text-primary">Weaving your parable...</p>
			<p class="mt-2 text-sm text-text-muted">This takes a moment. Your story is being crafted from everything you've shared.</p>
		</div>
	{/if}

	<!-- Generated story preview -->
	{#if generatedContent && !generating}
		<div class="mt-8 rounded-xl border border-accent/30 bg-surface-raised p-8">
			<p class="mb-2 text-xs font-medium text-accent uppercase tracking-wider">Your Parable</p>
			{#if generatedTitle}
				<h3 class="mb-4 font-serif text-2xl text-text-primary">{generatedTitle}</h3>
			{/if}
			<p class="font-serif leading-loose text-text-secondary whitespace-pre-wrap">{generatedContent}</p>

			<form method="POST" action="?/saveStory" use:enhance={() => { return async ({ update }) => { generatedTitle = ''; generatedContent = ''; await update(); }; }}>
				<input type="hidden" name="title" value={generatedTitle} />
				<input type="hidden" name="content" value={generatedContent} />
				<div class="mt-6 flex flex-col items-center gap-3 border-t border-border-subtle pt-6 sm:flex-row sm:justify-center">
					<button type="submit" class="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
						Save to Your Timeline
					</button>
					<button type="button" onclick={generateStory} class="rounded-lg border border-border-medium px-4 py-2.5 text-sm text-text-secondary transition-colors hover:text-text-primary">
						Generate Another
					</button>
				</div>
				<p class="mt-3 text-center text-xs text-text-muted">Saving adds this parable to your timeline.</p>
			</form>
		</div>
	{/if}

	{#if form?.error}
		<p class="mt-4 text-sm text-danger">{form.error}</p>
	{/if}

	<!-- Existing stories -->
	{#if data.stories.length > 0}
		<div class="mt-10 space-y-6">
			<h2 class="text-sm font-medium text-text-secondary">Saved Parables</h2>
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
							<h2 class="mb-4 font-serif text-2xl text-text-primary">{story.title}</h2>
						{/if}
						<div class="font-serif leading-loose text-text-secondary whitespace-pre-wrap">
							{story.content}
						</div>
						<div class="mt-6 flex items-center justify-between border-t border-border-subtle pt-4">
							<time class="text-xs text-text-muted">
								{new Date(story.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
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
</div>
