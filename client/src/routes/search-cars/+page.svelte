<!-- SearchBar.svelte -->
<script>
  import { PUBLIC_BASE_URL } from "$env/static/public";

  let searchQuery = "";
  let results = [];

  async function searchCars() {
    try {
      const token = localStorage.getItem("token");
      console.log(searchQuery);
      const response = await fetch(
        `${PUBLIC_BASE_URL}/api/car/search?q=${searchQuery}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      results = data.searchResults;
      console.log(results);
    } catch (error) {
      console.error("Error searching for cars:", error);
    }
  }
</script>

<div class="flex items-center w-full border">
  <span class="mr-2">Search Cars</span>
  <input
    type="text"
    class="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none"
    placeholder="Search for cars..."
    bind:value={searchQuery}
  />
  <button
    class="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg ml-2"
    on:click={searchCars}>Search</button
  >
</div>

<main>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-10">
    {#if results && results.length > 0}
      {#each results as car}
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
    {:else}
      <p>No search results found.</p>
    {/if}
  </div>
</main>
