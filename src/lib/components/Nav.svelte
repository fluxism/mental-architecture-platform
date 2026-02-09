<script lang="ts">
	import type { SessionUser } from '$lib/server/auth.js';

	let { user }: { user: SessionUser | null } = $props();
</script>

<nav class="sticky top-0 z-50 border-b border-border-subtle bg-surface-raised/95 backdrop-blur-sm">
	<div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
		<a href="/" class="group flex items-center gap-2">
			<span class="text-lg font-serif tracking-wide text-text-primary transition-colors group-hover:text-accent">
				BibleBabble
			</span>
		</a>

		{#if user}
			<div class="flex items-center gap-1">
				<a
					href="/dashboard"
					class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary"
				>
					Dashboard
				</a>
				<a
					href="/journal"
					class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary"
				>
					Journal
				</a>
				<a
					href="/beliefs"
					class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary"
				>
					Beliefs
				</a>
				<a
					href="/timeline"
					class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary"
				>
					Timeline
				</a>

				<div class="ml-3 flex items-center gap-3 border-l border-border-subtle pl-4">
					<span class="text-xs text-text-muted">
						{user.name ?? user.email}
					</span>
					<form method="POST" action="/auth/logout">
						<button
							type="submit"
							class="rounded-md px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-surface-overlay hover:text-status-active"
						>
							Logout
						</button>
					</form>
				</div>
			</div>
		{:else}
			<div class="flex items-center gap-2">
				<a
					href="/auth/login"
					class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary"
				>
					Sign In
				</a>
				<a
					href="/auth/register"
					class="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm text-accent transition-colors hover:border-accent-hover/50 hover:bg-accent/20 hover:text-accent-hover"
				>
					Register
				</a>
			</div>
		{/if}
	</div>
</nav>
