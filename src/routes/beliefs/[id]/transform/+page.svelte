<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let functionalBelief = $state((data.belief.functionalBelief || '') as string);
	let newAffirmation = $state('');
	let generatingBelief = $state(false);
	let generatingAffirmation = $state(false);
	let errorMessage = $state('');

	async function generateBelief() {
		generatingBelief = true;
		errorMessage = '';
		try {
			const res = await fetch('/api/ai/generate-functional-belief', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					belief: data.belief.statement,
					origins: data.origins.map((o: any) => ({ question: o.question, response: o.response }))
				})
			});
			if (!res.ok) throw new Error('Failed to generate');
			const result = await res.json();
			functionalBelief = result.functionalBelief;
		} catch {
			errorMessage = 'Could not generate right now. Try again in a moment.';
		}
		generatingBelief = false;
	}

	async function generateAffirmation() {
		generatingAffirmation = true;
		errorMessage = '';
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
			if (!res.ok) throw new Error('Failed to generate');
			const result = await res.json();
			newAffirmation = result.affirmation;
		} catch {
			errorMessage = 'Could not generate right now. Try again in a moment.';
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
				Consider <a href="/beliefs/{data.belief.id}/origin" class="text-accent hover:text-accent-hover">exploring the origin</a> first. Understanding where it came from makes transformation deeper.
			</p>
		</div>
	{/if}

	{#if errorMessage}
		<div class="mt-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
			{errorMessage}
		</div>
	{/if}

	<!-- Functional Belief -->
	<div class="mt-8">
		<h2 class="mb-2 font-serif text-xl text-text-primary">The New Belief</h2>
		<p class="mb-4 text-sm text-text-muted">
			What would you believe instead? Let AI suggest one, then make it yours.
		</p>

		<button
			onclick={generateBelief}
			disabled={generatingBelief}
			class="mb-4 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
		>
			{#if generatingBelief}
				<span class="inline-flex items-center gap-2">
					<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
						<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.3" />
						<path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
					</svg>
					Crafting your new belief...
				</span>
			{:else}
				{functionalBelief ? 'Regenerate with AI' : 'Generate with AI'}
			{/if}
		</button>

		<form method="POST" action="?/updateFunctionalBelief" use:enhance>
			<textarea
				name="functionalBelief"
				bind:value={functionalBelief}
				rows="3"
				placeholder="Your new belief will appear here — edit it until it feels true."
				class="w-full resize-y rounded-xl border border-border-subtle bg-surface-raised p-4 font-serif text-lg text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
			></textarea>
			<button
				type="submit"
				disabled={!functionalBelief.trim()}
				class="mt-3 rounded-lg bg-accent px-4 py-2 text-sm text-surface transition-colors hover:bg-accent-hover disabled:opacity-50"
			>
				Save New Belief
			</button>
		</form>
	</div>

	<!-- Affirmations -->
	<div class="mt-10">
		<h2 class="mb-2 font-serif text-xl text-text-primary">Affirmations</h2>
		<p class="mb-4 text-sm text-text-muted">
			Words that counter this belief. Generate one, edit it, or write your own.
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
			<button
				onclick={generateAffirmation}
				disabled={generatingAffirmation}
				class="mb-4 rounded-lg bg-accent px-4 py-2 text-sm text-surface transition-colors hover:bg-accent-hover disabled:opacity-50"
			>
				{#if generatingAffirmation}
					<span class="inline-flex items-center gap-2">
						<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
							<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.3" />
							<path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
						</svg>
						Writing your affirmation...
					</span>
				{:else}
					Generate with AI
				{/if}
			</button>

			<form method="POST" action="?/addAffirmation" use:enhance={() => { return async ({ update }) => { newAffirmation = ''; await update(); }; }}>
				<textarea
					name="content"
					bind:value={newAffirmation}
					rows="3"
					placeholder="Your affirmation will appear here — edit it or write your own..."
					class="w-full resize-y rounded-lg border border-border-subtle bg-surface p-3 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
				></textarea>
				<input type="hidden" name="isAiGenerated" value="false" />
				{#if form?.affirmationError}
					<p class="mt-1 text-sm text-danger">{form.affirmationError}</p>
				{/if}
				<button
					type="submit"
					disabled={!newAffirmation.trim()}
					class="mt-3 rounded-lg bg-warmth px-4 py-2 text-sm text-surface transition-colors hover:bg-warmth-hover disabled:opacity-50"
				>
					Save Affirmation
				</button>
			</form>
		</div>
	</div>

	<!-- Next step — prominent CTA -->
	<div class="mt-10 rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
		<p class="text-sm text-text-secondary">Your transformation is taking shape.</p>
		<a
			href="/beliefs/{data.belief.id}/story"
			class="mt-3 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-accent-hover"
		>
			Continue to Your Sacred Parable &rarr;
		</a>
	</div>
</div>
