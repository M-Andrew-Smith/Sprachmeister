import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({
    // Better Auth automatically detects the SvelteKit base URL
    // but you can explicitly set it if needed
});