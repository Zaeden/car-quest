<script>
  import { onMount } from "svelte";
  import { PUBLIC_BASE_URL } from "$env/static/public";

  let inventory = [];

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${PUBLIC_BASE_URL}/api/car/dealership`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const carData = await response.json();
      console.log(carData);
      inventory = carData.listOfCars;
      console.log(inventory);
    } catch (error) {
      console.log(error.message);
    }
  };
  onMount(fetchCars);
</script>

<main>
  <h1 class="text-3xl font-semibold mb-4 text-center">Inventory</h1>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-10">
    {#if inventory.length > 0}
      {#each inventory as car}
        <div class="bg-white shadow-md rounded-lg overflow-hidden" id={car._id}>
          <img
            src={car.carInfo.imageURL}
            alt={car.name + " " + car.model}
            class="w-full h-48 object-cover object-center"
          />
          <div class="p-4">
            <h3 class="text-xl font-semibold mb-2">{car.name}</h3>
            <p class="text-gray-600 mb-2">{car.model}</p>
            <p class="text-gray-800">Rs. {car.carInfo.price}</p>
            <div class="mt-4 flex justify-between">
              <a href={`/dealer/inventory/${car._id}`}>
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  View Details
                </button>
              </a>
              <a href={`/dealer/edit-vehicle/${car._id}`}>
                <button
                  class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit Car
                </button>
              </a>
            </div>
          </div>
        </div>
      {/each}
    {:else}
      <p>Loading...</p>
    {/if}
  </div>
</main>
