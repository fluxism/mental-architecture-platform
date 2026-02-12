<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let content = $state('');
</script>

<svelte:head>
	<title>New Entry - MAP</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<div class="mb-8">
		<h1 class="font-serif text-3xl text-text-primary">Express Yourself</h1>
		<p class="mt-1 text-text-secondary">No judgment, no forced positivity — just honest words.</p>
	</div>

	<!-- Prompts as inspiration -->
	<div class="mb-6 rounded-xl border border-border-subtle bg-surface-raised p-5">
		<p class="mb-3 text-sm text-text-muted">If you need a starting point, try one of these:</p>
		<ul class="space-y-1.5 text-sm text-text-secondary">
			{#each data.prompts as prompt}
				<li>{prompt}</li>
			{/each}
		</ul>
	</div>

	<form method="POST" use:enhance>
		{#if form?.error}
			<div class="mb-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
				{form.error}
			</div>
		{/if}

		<textarea
			name="content"
			bind:value={content}
			rows="12"
			placeholder="Begin writing here... Let whatever comes, come."
			class="w-full resize-y rounded-xl border border-border-subtle bg-surface-raised p-5 font-serif text-lg leading-relaxed text-text-primary placeholder-text-muted transition-colors focus:border-accent focus:outline-none"
		></textarea>

		<div class="mt-4 flex items-center justify-between">
			<span class="text-sm text-text-muted">
				{content.length} characters
			</span>
			<div class="flex gap-3">
				<a href="/journal" class="rounded-lg px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary">
					Cancel
				</a>
				<button
					type="submit"
					class="rounded-lg bg-accent px-6 py-2 text-sm font-medium text-surface transition-colors hover:bg-accent-hover disabled:opacity-50"
					disabled={content.trim().length === 0}
				>
					Save Entry
				</button>
			</div>
		</div>
	</form>
</div>
