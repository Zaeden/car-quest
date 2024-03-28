<script>
  import { PUBLIC_BASE_URL } from "$env/static/public";
  import { isLoggedIn } from "../../store";
  import { goto } from "$app/navigation";
  import toast from "svelte-french-toast";

  let formData = {
    email: "",
    password: "",
    userType: "",
  };

  const handleSubmit = async (e) => {
    console.log("clicked");
    try {
      console.log("again clicked");
      const response = await fetch(`${PUBLIC_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);
        localStorage.setItem("isLoggedIn", true);
        isLoggedIn.set(true);

        const role = data.role;
        if (role === "buyer") {
          await goto("/user");
        } else if (role === "dealer") {
          await goto("/dealer");
        }
        toast.success(data.message);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };
</script>

<div
  class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
>
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Login
      </h2>
    </div>
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            bind:value={formData.email}
          />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            bind:value={formData.password}
          />
        </div>
        <div>
          <label for="userType" class="sr-only">User Type</label>
          <select
            id="userType"
            name="userType"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            bind:value={formData.userType}
            required
          >
            <option value="" disabled selected class="text-gray-500"
              >Select User Type</option
            >
            <option value="buyer">Buyer</option>
            <option value="dealer">Dealer</option>
          </select>
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >Login</button
        >
      </div>
    </form>
  </div>
</div>
