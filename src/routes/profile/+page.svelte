<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let name = $state((data.user.name ?? '') as string);
	let gender = $state((data.user.gender ?? '') as string);
	let dateOfBirth = $state((data.user.dateOfBirth ?? '') as string);
	let placeOfBirth = $state((data.user.placeOfBirth ?? '') as string);
	let currentPassword = $state('');
	let newPassword = $state('');
</script>

<svelte:head>
	<title>Profile - MAP</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<h1 class="font-serif text-3xl text-text-primary">Your Profile</h1>
	<p class="mt-1 text-text-secondary">Update your personal information.</p>

	<!-- Profile Form -->
	<div class="mt-8 rounded-xl border border-border-subtle bg-surface-raised p-6">
		{#if form?.profileSaved}
			<div class="mb-4 rounded-lg border border-status-integrated/30 bg-status-integrated/10 p-3 text-sm text-status-integrated">
				Profile updated.
			</div>
		{/if}
		{#if form?.profileError}
			<div class="mb-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
				{form.profileError}
			</div>
		{/if}

		<form method="POST" action="?/updateProfile" use:enhance>
			<div class="space-y-5">
				<div>
					<label for="name" class="mb-1 block text-sm text-text-muted">Name</label>
					<input
						id="name"
						name="name"
						type="text"
						bind:value={name}
						placeholder="Your name"
						class="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm text-text-muted">Gender</label>
					<div class="flex gap-4">
						<label class="flex items-center gap-2 text-sm text-text-secondary">
							<input type="radio" name="gender" value="male" checked={gender === 'male'} onchange={() => gender = 'male'} class="accent-accent" />
							Male
						</label>
						<label class="flex items-center gap-2 text-sm text-text-secondary">
							<input type="radio" name="gender" value="female" checked={gender === 'female'} onchange={() => gender = 'female'} class="accent-accent" />
							Female
						</label>
					</div>
				</div>

				<div>
					<label for="dateOfBirth" class="mb-1 block text-sm text-text-muted">Date of Birth</label>
					<input
						id="dateOfBirth"
						name="dateOfBirth"
						type="date"
						bind:value={dateOfBirth}
						class="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-text-primary focus:border-accent focus:outline-none"
					/>
				</div>

				<div>
					<label for="placeOfBirth" class="mb-1 block text-sm text-text-muted">Place of Birth</label>
					<input
						id="placeOfBirth"
						name="placeOfBirth"
						type="text"
						bind:value={placeOfBirth}
						placeholder="City, Country"
						class="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
					/>
				</div>
			</div>

			<button
				type="submit"
				class="mt-6 rounded-lg bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
			>
				Save Profile
			</button>
		</form>
	</div>

	<!-- Password Change -->
	<div class="mt-8 rounded-xl border border-border-subtle bg-surface-raised p-6">
		<h2 class="mb-4 font-serif text-xl text-text-primary">Change Password</h2>

		{#if form?.passwordChanged}
			<div class="mb-4 rounded-lg border border-status-integrated/30 bg-status-integrated/10 p-3 text-sm text-status-integrated">
				Password changed.
			</div>
		{/if}
		{#if form?.passwordError}
			<div class="mb-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
				{form.passwordError}
			</div>
		{/if}

		<form method="POST" action="?/changePassword" use:enhance={() => { return async ({ update }) => { currentPassword = ''; newPassword = ''; await update(); }; }}>
			<div class="space-y-4">
				<div>
					<label for="currentPassword" class="mb-1 block text-sm text-text-muted">Current Password</label>
					<input
						id="currentPassword"
						name="currentPassword"
						type="password"
						bind:value={currentPassword}
						required
						class="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-text-primary focus:border-accent focus:outline-none"
					/>
				</div>
				<div>
					<label for="newPassword" class="mb-1 block text-sm text-text-muted">New Password</label>
					<input
						id="newPassword"
						name="newPassword"
						type="password"
						bind:value={newPassword}
						required
						minlength="8"
						placeholder="Minimum 8 characters"
						class="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
					/>
				</div>
			</div>

			<button
				type="submit"
				disabled={!currentPassword || newPassword.length < 8}
				class="mt-6 rounded-lg bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
			>
				Change Password
			</button>
		</form>
	</div>

	<!-- Account info -->
	<div class="mt-8 rounded-xl border border-border-subtle bg-surface-raised p-6">
		<h2 class="mb-3 font-serif text-xl text-text-primary">Account</h2>
		<div class="space-y-2 text-sm">
			<div class="flex justify-between">
				<span class="text-text-muted">Email</span>
				<span class="text-text-secondary">{data.user.email}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-text-muted">Role</span>
				<span class="text-text-secondary">{data.user.role}</span>
			</div>
		</div>
	</div>
</div>
