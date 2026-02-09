<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let functionalBelief = $state((data.belief.functionalBelief || '') as string);
	let newAffirmation = $state('');
	let generatingAffirmation = $state(false);

	async function generateAffirmation() {
		generatingAffirmation = true;
		try {
			const res = await fetch('/api/ai/generate-affirmation', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					belief: data.belief.statement,
					origins: data.origins.map((o: any) => ({ question: o.question, response: o.response })),
					functionalBelief: functionalBelief || undefined
				})
			});
			const result = await res.json();
			newAffirmation = result.affirmation;
		} catch {
			newAffirmation = '';
		}
		generatingAffirmation = false;
	}
</script>

<svelte:head>
	<title>Transform Belief - MAP</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<a href="/beliefs/{data.belief.id}" class="mb-6 inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text-primary">
		&larr; Back to Belief
	</a>

	<h1 class="font-serif text-3xl text-text-primary">Transformation</h1>
	<p class="mt-2 text-text-secondary">
		Shifting: <span class="text-warmth italic">"{data.belief.statement}"</span>
	</p>

	{#if data.origins.length === 0}
		<div class="mt-6 rounded-xl border border-warmth/30 bg-warmth/5 p-5">
			<p class="text-text-secondary">
				Consider <a href="/beliefs/{data.belief.id}/origin" class="text-accent hover:text-accent-hover">exploring the origin</a> of this belief first. Understanding where it came from makes transformation more grounded and lasting.
			</p>
		</div>
	{/if}

	<!-- Functional Belief -->
	<div class="mt-8">
		<h2 class="mb-2 font-serif text-xl text-text-primary">The New Belief</h2>
		<p class="mb-4 text-sm text-text-muted">
			What would you like to believe instead? Write something that feels true and reachable — not forced.
		</p>

		<form method="POST" action="?/updateFunctionalBelief" use:enhance>
			<textarea
				name="functionalBelief"
				bind:value={functionalBelief}
				rows="3"
				placeholder="e.g., 'I am enough as I am, and my worth isn't measured by performance.'"
				class="w-full resize-y rounded-xl border border-border-subtle bg-surface-raised p-4 font-serif text-lg text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
			></textarea>
			<button type="submit" class="mt-3 rounded-lg bg-accent px-4 py-2 text-sm text-white transition-colors hover:bg-accent-hover">
				Save New Belief
			</button>
		</form>
	</div>

	<!-- Affirmations -->
	<div class="mt-10">
		<h2 class="mb-2 font-serif text-xl text-text-primary">Affirmations</h2>
		<p class="mb-4 text-sm text-text-muted">
			Personalized affirmations that directly counter this belief. Generate one with AI or write your own.
		</p>

		{#if data.affirmations.length > 0}
			<div class="mb-6 space-y-3">
				{#each data.affirmations as affirmation}
					<div class="rounded-xl border border-accent/20 bg-accent/5 p-5">
						<p class="font-serif text-lg text-text-primary italic">{affirmation.content}</p>
						<div class="mt-3 flex items-center justify-between">
							<span class="text-xs text-text-muted">
								{affirmation.isAiGenerated ? 'AI-generated' : 'Written by you'} &middot;
								{new Date(affirmation.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
							</span>
							<form method="POST" action="?/deleteAffirmation" use:enhance>
								<input type="hidden" name="affirmationId" value={affirmation.id} />
								<button type="submit" class="text-xs text-text-muted hover:text-danger">Remove</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Generate or write affirmation -->
		<div class="rounded-xl border border-border-subtle bg-surface-raised p-5">
			<div class="mb-4 flex gap-3">
				<button
					onclick={generateAffirmation}
					disabled={generatingAffirmation}
					class="rounded-lg bg-accent px-4 py-2 text-sm text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
				>
					{generatingAffirmation ? 'Generating...' : 'Generate with AI'}
				</button>
			</div>

			<form method="POST" action="?/addAffirmation" use:enhance={() => { return async ({ update }) => { newAffirmation = ''; await update(); }; }}>
				<textarea
					name="content"
					bind:value={newAffirmation}
					rows="3"
					placeholder="Write an affirmation, or generate one above and edit it..."
					class="w-full resize-y rounded-lg border border-border-subtle bg-surface p-3 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
				></textarea>
				<input type="hidden" name="isAiGenerated" value={generatingAffirmation ? 'false' : 'false'} />
				{#if form?.affirmationError}
					<p class="mt-1 text-sm text-danger">{form.affirmationError}</p>
				{/if}
				<button
					type="submit"
					disabled={!newAffirmation.trim()}
					class="mt-3 rounded-lg bg-warmth px-4 py-2 text-sm text-white transition-colors hover:bg-warmth-hover disabled:opacity-50"
				>
					Save Affirmation
				</button>
			</form>
		</div>
	</div>

	<!-- Next step -->
	<div class="mt-8 text-center">
		<a href="/beliefs/{data.belief.id}/story" class="text-sm text-accent transition-colors hover:text-accent-hover">
			Ready for a mythic story? &rarr;
		</a>
	</div>
</div>
