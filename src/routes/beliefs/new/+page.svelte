<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let statement = $state(data.prefillStatement as string);
</script>

<svelte:head>
	<title>Add Belief - BibleBabble</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-8">
	<a href="/beliefs" class="mb-6 inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text-primary">
		&larr; Back to Beliefs
	</a>

	<h1 class="font-serif text-3xl text-text-primary">Name a Belief</h1>
	<p class="mt-2 text-text-secondary">
		What belief is currently shaping your life? Write it as a statement you tell yourself.
	</p>

	<div class="mt-4 rounded-lg border border-border-subtle bg-surface-overlay p-4">
		<p class="text-sm text-text-muted">Examples:</p>
		<ul class="mt-2 space-y-1 text-sm text-text-secondary">
			<li>"I'm not enough."</li>
			<li>"People always leave."</li>
			<li>"If I fail, I lose my value."</li>
			<li>"I don't deserve good things."</li>
		</ul>
	</div>

	<form method="POST" use:enhance class="mt-6">
		{#if data.entryId}
			<input type="hidden" name="entryId" value={data.entryId} />
		{/if}

		{#if form?.error}
			<div class="mb-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
				{form.error}
			</div>
		{/if}

		<textarea
			name="statement"
			bind:value={statement}
			rows="3"
			placeholder="Write the belief as you experience it..."
			class="w-full resize-y rounded-xl border border-border-subtle bg-surface-raised p-4 font-serif text-lg text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
		></textarea>

		<div class="mt-4 flex gap-3">
			<button
				type="submit"
				disabled={statement.trim().length === 0}
				class="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
			>
				Add Belief
			</button>
			<a href="/beliefs" class="rounded-lg px-4 py-2.5 text-sm text-text-secondary transition-colors hover:text-text-primary">
				Cancel
			</a>
		</div>
	</form>
</div>
