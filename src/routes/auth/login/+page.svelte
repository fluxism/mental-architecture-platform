<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types.js';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex min-h-screen items-center justify-center px-4">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<h1 class="text-2xl font-light tracking-wide text-text-primary">Welcome back</h1>
			<p class="mt-2 text-sm text-text-secondary">
				Pick up where you left off.
			</p>
		</div>

		{#if form?.error}
			<div
				class="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
			>
				{form.error}
			</div>
		{/if}

		<form method="POST" use:enhance class="space-y-5">
			<div>
				<label for="email" class="block text-sm font-medium text-text-secondary">
					Email
				</label>
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					required
					value={form?.email ?? ''}
					placeholder="you@example.com"
					class="mt-1.5 w-full rounded-lg border border-border-subtle bg-surface-raised px-4 py-2.5 text-text-primary placeholder-text-muted outline-none transition-colors focus:border-accent"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-text-secondary">
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
					placeholder="Your password"
					class="mt-1.5 w-full rounded-lg border border-border-subtle bg-surface-raised px-4 py-2.5 text-text-primary placeholder-text-muted outline-none transition-colors focus:border-accent"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent-hover"
			>
				Sign in
			</button>
		</form>

		<p class="text-center text-sm text-text-secondary">
			Don't have an account?
			<a href="/auth/register" class="text-accent transition-colors hover:text-accent-hover">
				Create one
			</a>
		</p>
	</div>
</div>
