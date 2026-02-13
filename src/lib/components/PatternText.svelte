<script lang="ts">
	import { patternDefinitions } from '$lib/patterns.js';

	let { text, class: className = '' }: { text: string; class?: string } = $props();

	let activePattern = $state<string | null>(null);
	let activeDefinition = $state<string | null>(null);

	type Segment = { type: 'text'; value: string } | { type: 'pattern'; name: string };

	let segments = $derived.by(() => {
		const result: Segment[] = [];
		const regex = /\[\[([^\]]+)\]\]/g;
		let lastIndex = 0;
		let match;
		while ((match = regex.exec(text)) !== null) {
			if (match.index > lastIndex) {
				result.push({ type: 'text', value: text.slice(lastIndex, match.index) });
			}
			result.push({ type: 'pattern', name: match[1] });
			lastIndex = match.index + match[0].length;
		}
		if (lastIndex < text.length) {
			result.push({ type: 'text', value: text.slice(lastIndex) });
		}
		return result;
	});

	function openPattern(name: string) {
		const key = Object.keys(patternDefinitions).find(
			(k) => k.toLowerCase() === name.toLowerCase()
		);
		activePattern = name;
		activeDefinition = key ? patternDefinitions[key] : `${name}: a recognized therapeutic pattern.`;
	}

	function closeModal() {
		activePattern = null;
		activeDefinition = null;
	}
</script>

<span class={className}>{#each segments as seg, i (i)}{#if seg.type === 'text'}{seg.value}{:else}<button
			onclick={() => openPattern(seg.name)}
			class="cursor-pointer border-b border-accent/50 text-accent transition-colors hover:text-accent-hover"
		>{seg.name}</button>{/if}{/each}</span>

{#if activePattern && activeDefinition}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		onkeydown={(e) => { if (e.key === 'Escape') closeModal(); }}
		onclick={closeModal}
	>
		<div
			class="w-full max-w-md rounded-2xl border border-border-subtle bg-surface-raised p-6 shadow-2xl"
			role="document"
			onclick={(e) => e.stopPropagation()}
		>
			<h3 class="font-serif text-xl text-text-primary">{activePattern}</h3>
			<p class="mt-3 leading-relaxed text-text-secondary">{activeDefinition}</p>
			<button
				onclick={closeModal}
				class="mt-5 rounded-lg bg-surface-overlay px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
			>
				Close
			</button>
		</div>
	</div>
{/if}
