<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>BibleBabble - Map your beliefs. Rewrite your story.</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-53px)] flex-col items-center justify-center px-6">
	<!-- Hero -->
	<div class="mx-auto max-w-2xl text-center">
		<!-- Decorative accent line -->
		<div class="mb-8 flex justify-center">
			<div class="h-px w-24 bg-gradient-to-r from-transparent via-accent/60 to-transparent"></div>
		</div>

		<h1 class="mb-4 font-serif text-5xl tracking-tight text-text-primary sm:text-6xl">
			BibleBabble
		</h1>

		<p class="mb-10 text-lg leading-relaxed text-warmth/90 font-serif italic">
			Map your beliefs. Rewrite your story.
		</p>

		<!-- Decorative accent line -->
		<div class="mb-12 flex justify-center">
			<div class="h-px w-16 bg-gradient-to-r from-transparent via-border-medium to-transparent"></div>
		</div>

		<div class="mx-auto mb-14 max-w-lg space-y-3 text-sm leading-relaxed text-text-secondary">
			<p>
				We all carry stories about who we are -- inherited, absorbed, repeated until they feel like truth.
			</p>
			<p>
				BibleBabble is a private space to surface those beliefs, trace their origins,
				and gently transform the ones that no longer serve you.
			</p>
			<p>
				Journal with AI-guided reflection. Track beliefs as they shift.
				Watch your inner narrative evolve over time.
			</p>
		</div>

		<!-- CTA Buttons -->
		<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
			<a
				href="/auth/register"
				class="inline-flex items-center rounded-lg border border-accent/30 bg-accent/15 px-8 py-3 text-sm font-medium text-accent transition-all duration-200 hover:border-accent-hover/40 hover:bg-accent/25 hover:text-accent-hover hover:shadow-lg hover:shadow-accent/5"
			>
				Begin Your Journey
			</a>
			<a
				href="/auth/login"
				class="inline-flex items-center rounded-lg border border-border-subtle px-8 py-3 text-sm text-text-secondary transition-all duration-200 hover:border-border-medium hover:bg-surface-raised hover:text-text-primary"
			>
				Sign In
			</a>
		</div>
	</div>

	<!-- Bottom decorative element -->
	<div class="mt-24 flex flex-col items-center gap-2 opacity-40">
		<div class="h-8 w-px bg-gradient-to-b from-border-subtle to-transparent"></div>
		<div class="h-1 w-1 rounded-full bg-accent/50"></div>
	</div>
</div>
