<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { BookOpen, LayoutDashboard, Library, LogOut, GraduationCap, LogIn } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { authClient } from "$lib/auth-client";

  const session = authClient.useSession();

  async function handleLogout() {
    await authClient.signOut();
    goto("/");
  }

  function isActive(path: string) {
    return $page.url.pathname === path;
  }

  function includesPath(part: string) {
    return $page.url.pathname.includes(part);
  }
</script>

<nav class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
  <div class="container mx-auto flex h-16 items-center justify-between px-4">

    <button
      type="button"
      class="flex items-center gap-2 cursor-pointer"
      aria-label="Go to home"
      onclick={() => goto("/")}
    >
      <div class="bg-primary p-1.5 rounded-lg">
        <GraduationCap class="h-6 w-6 text-primary-foreground" />
      </div>
      <span class="text-xl font-bold tracking-tighter">
        Sprach<span class="text-blue-600">meister</span>
      </span>
    </button>

    <div class="hidden md:flex items-center gap-1">
      <Button
        variant={isActive("/dashboard") ? "secondary" : "ghost"}
        class="gap-2"
        onclick={() => goto("/dashboard")}
      >
        <LayoutDashboard class="h-4 w-4" />
        Dashboard
      </Button>

      <Button
        variant={includesPath("/vocab") ? "secondary" : "ghost"}
        class="gap-2"
        onclick={() => goto("/dashboard/vocab")}
      >
        <Library class="h-4 w-4" />
        Vocab
      </Button>

      <Button
        variant={includesPath("/read") ? "secondary" : "ghost"}
        class="gap-2"
        onclick={() => goto("/dashboard/read")}
      >
        <BookOpen class="h-4 w-4" />
        Reading
      </Button>
    </div>

    <div class="flex items-center gap-4">
      {#if $session.data}
        <Button
          variant="ghost"
          size="icon"
          class="text-muted-foreground hover:text-destructive"
          onclick={handleLogout}
          aria-label="Log out"
          title="Log out"
        >
          <LogOut class="h-5 w-5" />
        </Button>
      {:else}
        <Button
          variant="ghost"
          size="icon"
          class="text-muted-foreground"
          onclick={() => goto("/login")}
          aria-label="Log in"
          title="Log in"
        >
          <LogIn class="h-5 w-5" />
        </Button>
      {/if}
    </div>
  </div>
</nav>
