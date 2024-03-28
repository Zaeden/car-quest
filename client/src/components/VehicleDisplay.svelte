<script>
  import { onMount } from "svelte";
  import { PUBLIC_BASE_URL } from "$env/static/public";

  let cars = [];

  const fetchCarsData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${PUBLIC_BASE_URL}/api/car/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const carData = await response.json();
      if (carData) {
        cars = carData.data;
        console.log(cars);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  onMount(fetchCarsData);
</script>

<main>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-10">
    {#each cars as car}
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
          </div>
        </div>
      </div>
    {/each}
  </div>
</main>
