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

<div class="h-screen p-6 bg-gray-100 rounded-lg shadow-md">
  <h1 class="text-3xl font-semibold mb-4">
    Welcome to the Dealership Dashboard
  </h1>
  <h2 class="text-xl font-medium mb-2">
    Total Inventory Count: {inventory.length}
  </h2>
  <p class="text-gray-700 mb-4">Manage your inventory below:</p>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <a href="/dealer/inventory">
      <div class="bg-white rounded-lg shadow-md p-4 cursor-pointer">
        <h3 class="text-lg font-semibold mb-2">Inventory Overview</h3>
        <p class="text-gray-600">
          View a comprehensive overview of your inventory.
        </p>
      </div>
    </a>

    <a href="/dealer/add-vehicle">
      <div class="bg-white rounded-lg shadow-md p-4 cursor-pointer">
        <h3 class="text-lg font-semibold mb-2">Add New Car</h3>
        <p class="text-gray-600">Add a new car to your inventory.</p>
      </div>
    </a>

    <a href="/dealer/sold-vehicle">
      <div class="bg-white rounded-lg shadow-md p-4 cursor-pointer">
        <h3 class="text-lg font-semibold mb-2">Sold Cars</h3>
        <p class="text-gray-600">
          Details of all the sold cars.
        </p>
      </div>
    </a>
  </div>
</div>
