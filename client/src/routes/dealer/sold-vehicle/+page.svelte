<script>
  import { onMount } from "svelte";
  import { PUBLIC_BASE_URL } from "$env/static/public";

  let soldVehicles = [];

  onMount(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${PUBLIC_BASE_URL}/api/car/dealership/sold`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      soldVehicles = data.cars;
    } catch (error) {
      console.error("Error fetching sold vehicles:", error);
    }
  });
</script>

<div class="max-w-4xl mx-auto p-10">
  <h1 class="text-2xl font-bold mb-4">Sold Vehicles</h1>
  {#if soldVehicles.length > 0}
    <ul class="divide-y divide-gray-200">
      {#each soldVehicles as vehicle}
        <li class="py-2">
          <div class="flex items-center justify-between">
            {#if vehicle.carInfo.imageURL}
              <img
                src={vehicle.carInfo.imageURL}
                alt="{vehicle.make} {vehicle.model} Image"
                class="w-20 h-20 object-cover rounded-lg"
              />
            {/if}
            <div>
              <h2 class="text-lg font-bold">{vehicle.name}</h2>
              <p class="text-gray-500">{vehicle.model}</p>
            </div>
            
            <div>
              <p class="text-gray-700">Price: Rs. {vehicle.carInfo.price}</p>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="text-gray-500">No sold vehicles found.</p>
  {/if}
</div>
