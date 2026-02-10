<script lang="ts">
	let { data } = $props();

	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		}).format(new Date(date));
	}
</script>

<svelte:head>
	<title>Admin - MAP</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-6 py-10">
	<div class="mb-10">
		<h1 class="font-serif text-2xl text-text-primary">Admin Dashboard</h1>
		<p class="mt-1 text-sm text-text-muted">User overview and management.</p>
	</div>

	<!-- Stats -->
	<div class="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
		<div class="rounded-lg border border-border-subtle bg-surface-raised p-4">
			<div class="text-2xl font-light text-text-primary">{data.stats.totalUsers}</div>
			<div class="mt-1 text-xs text-text-muted">Total Users</div>
		</div>
		<div class="rounded-lg border border-border-subtle bg-surface-raised p-4">
			<div class="text-2xl font-light text-text-primary">{data.stats.totalEntries}</div>
			<div class="mt-1 text-xs text-text-muted">Total Entries</div>
		</div>
		<div class="rounded-lg border border-border-subtle bg-surface-raised p-4">
			<div class="text-2xl font-light text-text-primary">{data.stats.totalBeliefs}</div>
			<div class="mt-1 text-xs text-text-muted">Total Beliefs</div>
		</div>
		<div class="rounded-lg border border-border-subtle bg-surface-raised p-4">
			<div class="text-2xl font-light text-text-primary">{data.stats.totalStories}</div>
			<div class="mt-1 text-xs text-text-muted">Total Stories</div>
		</div>
	</div>

	<!-- User Table -->
	<div class="rounded-lg border border-border-subtle bg-surface-raised">
		<div class="border-b border-border-subtle px-4 py-3">
			<h2 class="font-serif text-lg text-text-primary">Users</h2>
		</div>
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm">
				<thead>
					<tr class="border-b border-border-subtle text-xs text-text-muted">
						<th class="px-4 py-3 font-medium">Name</th>
						<th class="px-4 py-3 font-medium">Email</th>
						<th class="px-4 py-3 font-medium">Role</th>
						<th class="px-4 py-3 font-medium text-right">Entries</th>
						<th class="px-4 py-3 font-medium text-right">Beliefs</th>
						<th class="px-4 py-3 font-medium text-right">Stories</th>
						<th class="px-4 py-3 font-medium text-right">Sessions</th>
						<th class="px-4 py-3 font-medium">Registered</th>
					</tr>
				</thead>
				<tbody>
					{#each data.users as user}
						<tr class="border-b border-border-subtle last:border-0 transition-colors hover:bg-surface-overlay">
							<td class="px-4 py-3">
								<a href="/admin/users/{user.id}" class="text-accent hover:text-accent-hover">
									{user.name ?? '—'}
								</a>
							</td>
							<td class="px-4 py-3 text-text-secondary">{user.email}</td>
							<td class="px-4 py-3">
								{#if user.role === 'admin'}
									<span class="rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent">admin</span>
								{:else}
									<span class="text-xs text-text-muted">user</span>
								{/if}
							</td>
							<td class="px-4 py-3 text-right text-text-secondary">{user.entries}</td>
							<td class="px-4 py-3 text-right text-text-secondary">{user.beliefs}</td>
							<td class="px-4 py-3 text-right text-text-secondary">{user.stories}</td>
							<td class="px-4 py-3 text-right text-text-secondary">{user.activeSessions}</td>
							<td class="px-4 py-3 text-text-muted">{formatDate(user.createdAt)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
