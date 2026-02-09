<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types.js';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex min-h-screen items-center justify-center px-4">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<h1 class="text-2xl font-light tracking-wide text-text-primary">Create your space</h1>
			<p class="mt-2 text-sm text-text-secondary">
				A quiet place to explore what you believe — and why.
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
				<label for="name" class="block text-sm font-medium text-text-secondary">
					Name <span class="text-text-muted">(optional)</span>
				</label>
				<input
					id="name"
					name="name"
					type="text"
					autocomplete="name"
					value={form?.name ?? ''}
					placeholder="What should we call you?"
					class="mt-1.5 w-full rounded-lg border border-border-subtle bg-surface-raised px-4 py-2.5 text-text-primary placeholder-text-muted outline-none transition-colors focus:border-accent"
				/>
			</div>

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
					autocomplete="new-password"
					required
					minlength={8}
					placeholder="At least 8 characters"
					class="mt-1.5 w-full rounded-lg border border-border-subtle bg-surface-raised px-4 py-2.5 text-text-primary placeholder-text-muted outline-none transition-colors focus:border-accent"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent-hover"
			>
				Begin
			</button>
		</form>

		<p class="text-center text-sm text-text-secondary">
			Already have an account?
			<a href="/auth/login" class="text-accent transition-colors hover:text-accent-hover">
				Sign in
			</a>
		</p>
	</div>
</div>
