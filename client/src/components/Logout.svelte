<script>
  import { isLoggedIn } from "../store";
  import { goto } from '$app/navigation';

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await response.json();
      if (data) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        isLoggedIn.set(false);
        await goto("/login");
      }
      console.log(data);
    } catch (error) {
      console.log(error.response.message);
    }
  };
</script>

<div class="flex items-center">
  <button
    on:click={handleLogout}
    class="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg mr-2 md:mr-4"
    >Logout</button
  >
</div>
