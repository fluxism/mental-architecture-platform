<script lang="ts">
	import { enhance } from '$app/forms';
	import PatternText from '$lib/components/PatternText.svelte';

	let { data, form } = $props();
	let response = $state('');
	let aiReflection = $state('');
	let loadingReflection = $state(false);

	async function getAiReflection() {
		loadingReflection = true;
		try {
			const res = await fetch('/api/ai/origin-inquiry', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					belief: data.belief.statement,
					existingResponses: data.origins.map((o: any) => ({ question: o.question, response: o.response }))
				})
			});
			const result = await res.json();
			aiReflection = result.reflection;
		} catch {
			aiReflection = '';
		}
		loadingReflection = false;
	}
</script>

<svelte:head>
	<title>Origin Inquiry - MAP</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<a href="/beliefs/{data.belief.id}" class="mb-6 inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text-primary">
		&larr; Back to Belief
	</a>

	<h1 class="font-serif text-3xl text-text-primary">Tracing the Origin</h1>
	<p class="mt-2 text-text-secondary">
		For: <span class="text-warmth italic">"{data.belief.statement}"</span>
	</p>
	<p class="mt-1 text-sm text-text-muted">
		The goal is context, not blame. Beliefs were learned, not chosen.
	</p>

	<!-- Guiding questions -->
	<div class="mt-8 rounded-xl border border-border-subtle bg-surface-raised p-5">
		<p class="mb-3 text-sm text-text-muted">Let these questions guide you. Answer whatever feels right.</p>
		<ul class="space-y-2 text-sm text-text-secondary">
			<li>When did you first feel this?</li>
			<li>Is there a specific memory tied to it?</li>
			<li>Did someone say this to you, or did you learn it on your own?</li>
			<li>What emotion comes up when you sit with this belief?</li>
			<li>Where do you feel it in your body?</li>
			<li>How did this belief once protect you?</li>
			<li>If it had a voice, whose voice would it be?</li>
			<li>Does the origin feel clear, vague, or forgotten?</li>
		</ul>
	</div>

	<!-- Write area -->
	<div class="mt-8">
		<form method="POST" action="?/answer" use:enhance={() => { return async ({ update }) => { response = ''; await update(); }; }}>
			<textarea
				name="response"
				bind:value={response}
				rows="6"
				placeholder="Write whatever comes to mind. There's no wrong answer."
				class="w-full resize-y rounded-xl border border-border-subtle bg-surface-raised p-4 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
			></textarea>
			{#if form?.error}
				<p class="mt-1 text-sm text-danger">{form.error}</p>
			{/if}
			<button
				type="submit"
				disabled={!response.trim()}
				class="mt-3 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent-hover disabled:opacity-50"
			>
				Save Response
			</button>
		</form>
	</div>

	<!-- Previous responses -->
	{#if data.origins.length > 0}
		<div class="mt-10 space-y-4">
			<h2 class="text-sm font-medium text-text-secondary">Your Responses</h2>
			{#each data.origins as origin}
				<div class="rounded-xl border border-border-subtle bg-surface-raised p-5">
					{#if origin.question !== 'Open reflection'}
						<p class="mb-1 text-xs text-warmth">{origin.question}</p>
					{/if}
					<p class="text-text-primary">{origin.response}</p>
					<div class="mt-3 flex items-center justify-between">
						<time class="text-xs text-text-muted">
							{new Date(origin.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
						</time>
						<form method="POST" action="?/deleteOrigin" use:enhance>
							<input type="hidden" name="originId" value={origin.id} />
							<button type="submit" class="text-xs text-text-muted hover:text-danger">Remove</button>
						</form>
					</div>
				</div>
			{/each}
		</div>

		<!-- AI Reflection -->
		<div class="mt-6">
			{#if aiReflection}
				<div class="rounded-xl border border-accent/20 bg-accent/5 p-5">
					<p class="mb-1 text-xs font-medium text-accent">AI Reflection</p>
					<PatternText text={aiReflection} class="text-text-secondary italic" />
				</div>
			{/if}
			<button
				onclick={getAiReflection}
				disabled={loadingReflection}
				class="mt-3 rounded-lg bg-surface-overlay px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary disabled:opacity-50"
			>
				{#if loadingReflection}
					<span class="inline-flex items-center gap-2">
						<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
							<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.3" />
							<path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
						</svg>
						Reflecting...
					</span>
				{:else}
					{aiReflection ? 'Get Another Reflection' : 'Get AI Reflection'}
				{/if}
			</button>
		</div>

		<!-- Next step -->
		<div class="mt-8 text-center">
			<a href="/beliefs/{data.belief.id}/transform" class="text-sm text-accent transition-colors hover:text-accent-hover">
				Ready to transform this belief? &rarr;
			</a>
		</div>
	{/if}
</div>
