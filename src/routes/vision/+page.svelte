<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let generating = $state(false);
	let generatedTitle = $state('');
	let generatedContent = $state('');
	let editingId = $state<string | null>(null);
	let editTitle = $state('');
	let editContent = $state('');

	async function generateVision() {
		generating = true;
		try {
			const res = await fetch('/api/ai/generate-vision', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({})
			});
			if (!res.ok) throw new Error('Generation failed');
			const text = await res.text();
			try {
				const result = JSON.parse(text);
				generatedTitle = result.title || '';
				generatedContent = result.content || '';
			} catch {
				generatedContent = text;
			}
		} catch {
			generatedTitle = '';
			generatedContent = '';
		}
		generating = false;
	}

	function startEdit(vision: any) {
		editingId = vision.id;
		editTitle = vision.title || '';
		editContent = vision.content;
	}
</script>

<svelte:head>
	<title>New Life Vision - MAP</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<h1 class="font-serif text-3xl text-text-primary">Your New Life Vision</h1>
	<p class="mt-2 text-text-secondary">
		A first-person vision of who you are becoming — your blueprint, your north star.
	</p>
	<p class="mt-1 text-sm text-text-muted">
		Written from your wounds, your truths, and your transformation. This is faith made visible.
	</p>

	<!-- Beliefs that inform the vision -->
	{#if data.allBeliefs.length > 0}
		<div class="mt-6 rounded-xl border border-border-subtle bg-surface-raised p-5">
			<p class="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Your inner landscape</p>
			<div class="space-y-1">
				{#each data.allBeliefs as b}
					<div class="flex items-center gap-2 text-sm">
						<span class="h-1.5 w-1.5 shrink-0 rounded-full
							{b.status === 'active' ? 'bg-text-primary' : ''}
							{b.status === 'shifting' ? 'bg-text-muted' : ''}
							{b.status === 'integrated' ? 'bg-text-secondary' : ''}
						"></span>
						<span class="text-text-secondary">
							"{b.statement}"
							{#if b.functionalBelief}
								<span class="text-text-muted">&rarr; "{b.functionalBelief}"</span>
							{/if}
						</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Existing visions -->
	{#if data.visions.length > 0}
		<div class="mt-8 space-y-6">
			{#each data.visions as vision}
				{#if editingId === vision.id}
					<form method="POST" action="?/update" use:enhance={() => { return async ({ update }) => { editingId = null; await update(); }; }} class="rounded-xl border border-border-subtle bg-surface-raised p-6">
						<input type="hidden" name="visionId" value={vision.id} />
						<input
							name="title"
							bind:value={editTitle}
							placeholder="Vision title..."
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
							<button type="button" onclick={() => editingId = null} class="text-sm text-text-secondary">Cancel</button>
						</div>
					</form>
				{:else}
					<div class="rounded-xl border border-border-subtle bg-surface-raised p-8">
						{#if vision.title}
							<h2 class="mb-4 font-serif text-2xl text-text-primary">{vision.title}</h2>
						{/if}
						<div class="font-serif leading-loose text-text-secondary whitespace-pre-wrap">
							{vision.content}
						</div>
						<div class="mt-6 flex items-center justify-between border-t border-border-subtle pt-4">
							<time class="text-xs text-text-muted">
								{new Date(vision.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
							</time>
							<div class="flex gap-3">
								<button onclick={() => startEdit(vision)} class="text-xs text-text-muted transition-colors hover:text-text-primary">Edit</button>
								<form method="POST" action="?/delete" use:enhance>
									<input type="hidden" name="visionId" value={vision.id} />
									<button type="submit" class="text-xs text-text-muted transition-colors hover:text-danger">Delete</button>
								</form>
							</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}

	<!-- Generate new vision -->
	<div class="mt-8">
		<h2 class="mb-2 font-serif text-xl text-text-primary">
			{data.visions.length > 0 ? 'Generate a New Vision' : 'Create Your Vision'}
		</h2>
		<p class="mb-4 text-sm text-text-muted">
			The AI will use everything you've shared — every belief, every wound, every step of growth — to write a first-person vision of your transformed life.
		</p>

		{#if data.allBeliefs.length === 0}
			<div class="mb-4 rounded-xl border border-border-subtle bg-surface-overlay p-5">
				<p class="text-sm text-text-secondary">
					Your vision will be richer once you've identified beliefs and explored their origins.
					<a href="/journal/new" class="text-accent hover:text-accent-hover">Start journaling</a> or
					<a href="/beliefs/new" class="text-accent hover:text-accent-hover">add a belief</a> first.
				</p>
			</div>
		{/if}

		<button
			onclick={generateVision}
			disabled={generating}
			class="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-accent-hover disabled:opacity-50"
		>
			{generating ? 'Envisioning your new life...' : 'Generate New Life Vision'}
		</button>

		{#if generatedContent}
			<div class="mt-6 rounded-xl border border-border-subtle bg-surface-raised p-8">
				<p class="mb-2 text-xs font-medium text-text-muted uppercase tracking-wider">Your New Life</p>
				{#if generatedTitle}
					<h3 class="mb-4 font-serif text-2xl text-text-primary">{generatedTitle}</h3>
				{/if}
				<p class="font-serif leading-loose text-text-secondary whitespace-pre-wrap">{generatedContent}</p>

				<form method="POST" action="?/save" use:enhance={() => { return async ({ update }) => { generatedTitle = ''; generatedContent = ''; await update(); }; }}>
					<input type="hidden" name="title" value={generatedTitle} />
					<input type="hidden" name="content" value={generatedContent} />
					<div class="mt-6 flex gap-3">
						<button type="submit" class="rounded-lg bg-accent px-4 py-2 text-sm text-surface transition-colors hover:bg-accent-hover">
							Save This Vision
						</button>
						<button type="button" onclick={generateVision} class="rounded-lg border border-border-medium px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary">
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
