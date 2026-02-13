<script lang="ts">
	let {
		sourceType,
		sourceId,
		aiOutput
	}: { sourceType: string; sourceId: string; aiOutput: string } = $props();

	let open = $state(false);
	let feedback = $state('');
	let saving = $state(false);
	let saved = $state(false);

	async function submit() {
		if (!feedback.trim()) return;
		saving = true;
		try {
			const res = await fetch('/api/ai/feedback', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sourceType, sourceId, aiOutput, feedback })
			});
			if (res.ok) {
				saved = true;
				setTimeout(() => {
					open = false;
					saved = false;
					feedback = '';
				}, 1500);
			}
		} catch {
			// silently fail
		}
		saving = false;
	}
</script>

{#if !open}
	<button
		onclick={() => open = true}
		class="text-xs text-text-muted transition-colors hover:text-text-secondary"
	>
		This isn't right
	</button>
{:else}
	<div class="mt-3 rounded-lg border border-border-subtle bg-surface-overlay p-3">
		{#if saved}
			<p class="text-sm text-status-integrated">Thanks — your feedback will improve future analysis.</p>
		{:else}
			<p class="mb-2 text-xs text-text-muted">What's inaccurate? Your correction will be used to improve future reflections.</p>
			<textarea
				bind:value={feedback}
				rows="2"
				placeholder="e.g. This isn't about abandonment — it's about..."
				class="w-full resize-y rounded-lg border border-border-subtle bg-surface p-2 text-sm text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
			></textarea>
			<div class="mt-2 flex gap-2">
				<button
					onclick={submit}
					disabled={!feedback.trim() || saving}
					class="rounded-lg bg-accent px-3 py-1.5 text-xs text-surface transition-colors hover:bg-accent-hover disabled:opacity-50"
				>
					{saving ? 'Saving...' : 'Submit Feedback'}
				</button>
				<button
					onclick={() => { open = false; feedback = ''; }}
					class="text-xs text-text-secondary"
				>
					Cancel
				</button>
			</div>
		{/if}
	</div>
{/if}
