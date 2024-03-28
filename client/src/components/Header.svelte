<script>
  import Logout from "./Logout.svelte";
  import { isLoggedIn } from "../store";
</script>

<header class="bg-gray-30 px-10 border">
  <div class="container mx-auto flex items-center justify-between py-4">
    <!-- Logo -->
    <div class="flex items-center mb-4 md:mb-0">
      <span class="text-xl font-bold">CarQuest</span>
    </div>

    <!-- Search Bar -->
    <div class="mx-4">
      <a href="/search-cars">
        <button
          type="button"
          class="flex items-center bg-white border rounded-lg px-4 py-2"
        >
          <span class="mr-2">
            <i class="fas fa-search text-gray-500"></i>
          </span>
          <span class="text-gray-500">Search</span>
        </button>
      </a>
    </div>

    {#if $isLoggedIn}
      <div class="flex">
        <Logout />
        <a href="/change-password">
          <button
            class="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg mr-2 md:mr-4 text-sm"
            >Change Password</button
          >
        </a>
        <a href="/user/bought-vehicle">
          <button
            class="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg mr-2 md:mr-4 text-sm"
            >My Vehicles</button
          >
        </a>
      </div>
    {:else}
      <div class="flex items-center">
        <button
          class="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg mr-2 md:mr-4"
          ><a href="/login">Login</a></button
        >
        <button
          class="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
          ><a href="/register">Register</a></button
        >
      </div>
    {/if}
  </div>
</header>
