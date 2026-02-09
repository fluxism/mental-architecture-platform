<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let currentQuestion = $state((data.remainingQuestions[0] || '') as string);
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
	<title>Origin Inquiry - BibleBabble</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<a href="/beliefs/{data.belief.id}" class="mb-6 inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text-primary">
		&larr; Back to Belief
	</a>

	<h1 class="font-serif text-3xl text-text-primary">Tracing the Origin</h1>
	<p class="mt-2 text-text-secondary">
		For the belief: <span class="text-warmth italic">"{data.belief.statement}"</span>
	</p>
	<p class="mt-1 text-sm text-text-muted">
		The goal is context, not blame. Beliefs were learned, not innate truths.
	</p>

	<!-- Previous responses -->
	{#if data.origins.length > 0}
		<div class="mt-8 space-y-4">
			<h2 class="text-sm font-medium text-text-secondary">Your Responses</h2>
			{#each data.origins as origin}
				<div class="rounded-xl border border-border-subtle bg-surface-raised p-5">
					<p class="text-sm font-medium text-warmth">{origin.question}</p>
					<p class="mt-2 text-text-primary">{origin.response}</p>
					<div class="mt-3 flex items-center justify-between">
						<time class="text-xs text-text-muted">
							{new Date(origin.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
					<p class="text-text-secondary italic">{aiReflection}</p>
				</div>
			{/if}
			<button
				onclick={getAiReflection}
				disabled={loadingReflection}
				class="mt-3 rounded-lg bg-surface-overlay px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary disabled:opacity-50"
			>
				{loadingReflection ? 'Reflecting...' : aiReflection ? 'Get Another Reflection' : 'Get AI Reflection'}
			</button>
		</div>
	{/if}

	<!-- Answer next question -->
	{#if data.remainingQuestions.length > 0}
		<div class="mt-8">
			<h2 class="mb-4 text-sm font-medium text-text-secondary">
				{data.origins.length === 0 ? 'Begin the Inquiry' : 'Continue Exploring'}
			</h2>

			<!-- Question selector -->
			<div class="mb-4">
				<label class="mb-2 block text-sm text-text-muted">Choose a question:</label>
				<div class="space-y-2">
					{#each data.remainingQuestions as question}
						<button
							type="button"
							onclick={() => currentQuestion = question}
							class="w-full rounded-lg p-3 text-left text-sm transition-colors
								{currentQuestion === question
									? 'border border-accent bg-accent/10 text-text-primary'
									: 'border border-border-subtle bg-surface-overlay text-text-secondary hover:border-border-medium'}"
						>
							{question}
						</button>
					{/each}
				</div>
			</div>

			{#if currentQuestion}
				<form method="POST" action="?/answer" use:enhance={() => { return async ({ update }) => { response = ''; await update(); }; }}>
					<input type="hidden" name="question" value={currentQuestion} />
					<p class="mb-3 font-serif text-lg text-warmth italic">"{currentQuestion}"</p>
					<textarea
						name="response"
						bind:value={response}
						rows="5"
						placeholder="Take your time. There's no wrong answer."
						class="w-full resize-y rounded-xl border border-border-subtle bg-surface-raised p-4 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
					></textarea>
					{#if form?.error}
						<p class="mt-1 text-sm text-danger">{form.error}</p>
					{/if}
					<button
						type="submit"
						disabled={!response.trim()}
						class="mt-3 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
					>
						Save Response
					</button>
				</form>
			{/if}
		</div>
	{:else if data.origins.length > 0}
		<div class="mt-8 rounded-xl border border-status-integrated/30 bg-status-integrated/5 p-6 text-center">
			<p class="font-serif text-lg text-status-integrated">You've explored all the guided questions.</p>
			<p class="mt-2 text-sm text-text-secondary">
				When you're ready, move on to <a href="/beliefs/{data.belief.id}/transform" class="text-accent hover:text-accent-hover">transformation</a>.
			</p>
		</div>
	{/if}
</div>
