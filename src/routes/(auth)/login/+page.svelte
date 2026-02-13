<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import { goto } from "$app/navigation";

  let email = $state("");
  let password = $state("");
  let errorMsg = $state("");
  let isSubmitting = $state(false);

  const session = authClient.useSession();

  async function handleLogout() {
    await authClient.signOut();
    await goto("/");
  }

  async function handleLogin(e: SubmitEvent) {
    e.preventDefault();

    isSubmitting = true;
    errorMsg = "";

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard"
    });

    if (error) {
      errorMsg = error.message || "Invalid email or password";
      isSubmitting = false;
      return;
    }

    await goto("/dashboard");
  }
</script>

<div class="min-h-screen bg-slate-50 flex items-center justify-center p-6">
  <div class="max-w-md w-full bg-white shadow-2xl rounded-3xl p-8 border border-slate-100 relative">

    {#if $session.data}
      <button
        type="button"
        class="absolute top-4 right-4 text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
        onclick={handleLogout}
      >
        Log out →
      </button>
    {/if}

    <div class="text-center mb-8">
      <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">
        Welcome Back
      </h1>
      <p class="text-slate-500 mt-2">Log in to your Sprachmeister account</p>
    </div>

    <form onsubmit={handleLogin} class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="name@example.com"
          required
          class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="••••••••"
          required
          class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {#if errorMsg}
        <div class="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
          {errorMsg}
        </div>
      {/if}

      <button
        type="submit"
        disabled={isSubmitting}
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Authenticating..." : "Sign In"}
      </button>
    </form>

    <div class="mt-8 pt-6 border-t border-slate-100 text-center">
      <p class="text-slate-600">
        Don't have an account?
        <a href="/signup" class="text-blue-600 font-semibold hover:underline ml-1">Create one</a>
      </p>
      <a href="/" class="block mt-4 text-sm text-slate-400 hover:text-slate-600 transition-colors">
        ← Back to Home
      </a>
    </div>
  </div>
</div>

<style>
  div {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
