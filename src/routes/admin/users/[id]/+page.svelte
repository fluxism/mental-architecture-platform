<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	function formatDate(date: Date | string | null): string {
		if (!date) return '—';
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		}).format(new Date(date));
	}
</script>

<svelte:head>
	<title>{data.targetUser.name ?? data.targetUser.email} - Admin - MAP</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-6 py-10">
	<div class="mb-6">
		<a href="/admin" class="text-sm text-text-muted transition-colors hover:text-accent">
			&larr; Back to Admin
		</a>
	</div>

	<!-- User Profile Card -->
	<div class="mb-8 rounded-lg border border-border-subtle bg-surface-raised p-6">
		<div class="flex items-start justify-between">
			<div>
				<h1 class="font-serif text-2xl text-text-primary">
					{data.targetUser.name ?? 'Unnamed User'}
				</h1>
				<p class="mt-1 text-sm text-text-secondary">{data.targetUser.email}</p>
			</div>
			{#if data.targetUser.role === 'admin'}
				<span class="rounded-full bg-accent/15 px-3 py-1 text-xs text-accent">admin</span>
			{:else}
				<span class="rounded-full bg-surface-overlay px-3 py-1 text-xs text-text-muted">user</span>
			{/if}
		</div>

		<div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
			<div>
				<div class="text-xs text-text-muted">Gender</div>
				<div class="mt-0.5 text-sm text-text-secondary">{data.targetUser.gender ?? '—'}</div>
			</div>
			<div>
				<div class="text-xs text-text-muted">Date of Birth</div>
				<div class="mt-0.5 text-sm text-text-secondary">{data.targetUser.dateOfBirth ?? '—'}</div>
			</div>
			<div>
				<div class="text-xs text-text-muted">Place of Birth</div>
				<div class="mt-0.5 text-sm text-text-secondary">{data.targetUser.placeOfBirth ?? '—'}</div>
			</div>
			<div>
				<div class="text-xs text-text-muted">Registered</div>
				<div class="mt-0.5 text-sm text-text-secondary">{formatDate(data.targetUser.createdAt)}</div>
			</div>
		</div>
	</div>

	<!-- Activity Breakdown -->
	<div class="mb-8">
		<h2 class="mb-4 font-serif text-lg text-text-primary">Activity</h2>
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
			<div class="rounded-lg border border-border-subtle bg-surface-raised p-4">
				<div class="text-2xl font-light text-text-primary">{data.activity.entries}</div>
				<div class="mt-1 text-xs text-text-muted">Journal Entries</div>
			</div>
			<div class="rounded-lg border border-border-subtle bg-surface-raised p-4">
				<div class="text-2xl font-light text-text-primary">{data.activity.totalBeliefs}</div>
				<div class="mt-1 text-xs text-text-muted">Beliefs</div>
			</div>
			<div class="rounded-lg border border-border-subtle bg-surface-raised p-4">
				<div class="text-2xl font-light text-text-primary">{data.activity.stories}</div>
				<div class="mt-1 text-xs text-text-muted">Stories</div>
			</div>
			<div class="rounded-lg border border-border-subtle bg-surface-raised p-4">
				<div class="text-2xl font-light text-text-primary">{data.activity.affirmations}</div>
				<div class="mt-1 text-xs text-text-muted">Affirmations</div>
			</div>
			<div class="rounded-lg border border-border-subtle bg-surface-raised p-4">
				<div class="text-2xl font-light text-text-primary">{data.activity.reflections}</div>
				<div class="mt-1 text-xs text-text-muted">Reflections</div>
			</div>
			<div class="rounded-lg border border-border-subtle bg-surface-raised p-4">
				<div class="text-2xl font-light text-text-primary">{data.activity.visions}</div>
				<div class="mt-1 text-xs text-text-muted">Life Visions</div>
			</div>
			<div class="rounded-lg border border-border-subtle bg-surface-raised p-4">
				<div class="text-2xl font-light text-text-primary">{data.activity.activeSessions}</div>
				<div class="mt-1 text-xs text-text-muted">Active Sessions</div>
			</div>
			<div class="rounded-lg border border-border-subtle bg-surface-raised p-4">
				<div class="text-sm text-text-primary">{formatDate(data.activity.lastEntryDate)}</div>
				<div class="mt-1 text-xs text-text-muted">Last Entry</div>
			</div>
		</div>

		<!-- Belief Status Breakdown -->
		{#if data.activity.totalBeliefs > 0}
			<div class="mt-4 rounded-lg border border-border-subtle bg-surface-raised p-4">
				<h3 class="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Beliefs by Status</h3>
				<div class="flex gap-6">
					<div class="flex items-center gap-2">
						<div class="h-2 w-2 rounded-full bg-status-active"></div>
						<span class="text-xs text-text-secondary">Active</span>
						<span class="text-xs text-text-muted">{data.activity.beliefCounts.active}</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="h-2 w-2 rounded-full bg-status-shifting"></div>
						<span class="text-xs text-text-secondary">Shifting</span>
						<span class="text-xs text-text-muted">{data.activity.beliefCounts.shifting}</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="h-2 w-2 rounded-full bg-status-integrated"></div>
						<span class="text-xs text-text-secondary">Integrated</span>
						<span class="text-xs text-text-muted">{data.activity.beliefCounts.integrated}</span>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Password Reset -->
	<div class="rounded-lg border border-border-subtle bg-surface-raised p-6">
		<h2 class="mb-4 font-serif text-lg text-text-primary">Reset Password</h2>

		{#if form?.success}
			<div class="mb-4 rounded-md border border-status-integrated/30 bg-status-integrated/10 px-4 py-3 text-sm text-status-integrated">
				Password reset successfully. All of this user's sessions have been invalidated.
			</div>
		{/if}

		{#if form?.error}
			<div class="mb-4 rounded-md border border-status-active/30 bg-status-active/10 px-4 py-3 text-sm text-status-active">
				{form.error}
			</div>
		{/if}

		<form method="POST" action="?/resetPassword" use:enhance>
			<div class="flex gap-3">
				<input
					type="password"
					name="newPassword"
					placeholder="New password (min 8 characters)"
					required
					minlength="8"
					class="flex-1 rounded-md border border-border-subtle bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
				/>
				<button
					type="submit"
					class="rounded-md border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/20 hover:text-accent-hover"
				>
					Reset Password
				</button>
			</div>
		</form>
	</div>
</div>
