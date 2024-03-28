<script>
  import { toast } from "svelte-french-toast";
  import { goto } from "$app/navigation";
  import { PUBLIC_BASE_URL } from "$env/static/public";

  let currentPassword = "";
  let newPassword = "";

  async function handleChangePassword() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const response = await fetch(
      `${PUBLIC_BASE_URL}/api/auth/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword, role }),
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log(data);
      toast.success(data.message);
      currentPassword = "";
      newPassword = "";
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      isLoggedIn.set(false);
      await goto("/login");
    } else {
      currentPassword = "";
      newPassword = "";
      toast.error("Failed to change password");
    }
  }
</script>

<main class="container mx-auto px-4">
  <h1 class="text-2xl font-bold mb-4">Change Password</h1>
  <form on:submit|preventDefault={handleChangePassword} class="max-w-sm">
    <div class="mb-4">
      <label for="currentPassword" class="block text-gray-700 font-bold mb-2"
        >Current Password:</label
      >
      <input
        type="password"
        id="currentPassword"
        bind:value={currentPassword}
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
    <div class="mb-6">
      <label for="newPassword" class="block text-gray-700 font-bold mb-2"
        >New Password:</label
      >
      <input
        type="password"
        id="newPassword"
        bind:value={newPassword}
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >Change Password</button
    >
  </form>
</main>
