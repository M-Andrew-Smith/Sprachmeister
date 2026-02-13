<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import { goto } from "$app/navigation";

  let name = $state("");
  let email = $state("");
  let password = $state("");
  let errorMsg = $state("");
  let isSubmitting = $state(false);

  const session = authClient.useSession();

  async function handleLogout() {
    await authClient.signOut();
    await goto("/");
  }

  async function handleSignUp(e: SubmitEvent) {
    e.preventDefault();
    isSubmitting = true;
    errorMsg = "";

    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/dashboard"
    });

    if (error) {
      errorMsg = error.message ?? "An unknown error occurred";
      isSubmitting = false;
      return;
    }

    await goto("/dashboard");
  }
</script>

<main class="min-h-screen bg-slate-50 flex items-center justify-center p-6">
  <section class="max-w-md w-full bg-white shadow-2xl rounded-3xl p-8 border border-slate-100 relative">

    {#if $session.data}
      <button
        type="button"
        class="absolute top-4 right-4 text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
        onclick={handleLogout}
      >
        Log out →
      </button>
    {/if}

    <header class="text-center mb-8">
      <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
      <p class="text-slate-500 mt-2">Start your journey to German mastery</p>
    </header>

    <form onsubmit={handleSignUp} class="space-y-4">
      <div class="space-y-1">
        <label for="signup-name" class="block text-sm font-medium text-slate-700">Full Name</label>
        <input
          id="signup-name"
          type="text"
          bind:value={name}
          placeholder="Johann Goethe"
          required
          class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div class="space-y-1">
        <label for="signup-email" class="block text-sm font-medium text-slate-700">Email Address</label>
        <input
          id="signup-email"
          type="email"
          bind:value={email}
          placeholder="name@example.com"
          required
          class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div class="space-y-1">
        <label for="signup-password" class="block text-sm font-medium text-slate-700">Password</label>
        <input
          id="signup-password"
          type="password"
          bind:value={password}
          placeholder="••••••••"
          required
          class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      {#if errorMsg}
        <div role="alert" class="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
          {errorMsg}
        </div>
      {/if}

      <button
        type="submit"
        disabled={isSubmitting}
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg disabled:opacity-50"
      >
        {isSubmitting ? "Creating Account..." : "Join Sprachmeister"}
      </button>
    </form>

    <footer class="mt-8 pt-6 border-t border-slate-100 text-center">
      <p class="text-slate-600">
        Already have an account?
        <a href="/login" class="text-blue-600 font-semibold hover:underline">Log in instead</a>
      </p>
    </footer>
  </section>
</main>
