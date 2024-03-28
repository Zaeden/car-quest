<script>
  import toast from "svelte-french-toast";
  import { goto } from '$app/navigation';
  import { PUBLIC_BASE_URL } from "$env/static/public";

  let formData = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    userType: "",
  };

  const handleSubmit = async (e) => {
    try {
      const response = await fetch(`${PUBLIC_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await response.json();
      if (data) {
        toast.success(data.message);
        await goto("/login");
      }
      console.log(data);
    } catch (error) {
      toast.error(error.response.message)
      console.log(error.response.message);
    }
  };
</script>

<div
  class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
>
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Register
      </h2>
    </div>
    <form
      method="post"
      class="mt-8 space-y-6"
      on:submit|preventDefault={handleSubmit}
    >
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="firstname" class="sr-only">First Name</label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="First Name"
            bind:value={formData.firstname}
          />
        </div>
        <div>
          <label for="lastname" class="sr-only">Last Name</label>
          <input
            id="lastname"
            name="lastname"
            type="text"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Last Name"
            bind:value={formData.lastname}
          />
        </div>
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
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
          >Register</button
        >
      </div>
    </form>
  </div>
</div>
