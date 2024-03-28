<script>
  import { page } from "$app/stores";
  import { PUBLIC_BASE_URL } from "$env/static/public";
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";

  let car = {};
  let role = localStorage.getItem("role");
  let dealerId = "";
  let isSold = null;
  let dealer = "";

  const getDetails = async () => {
    const carId = $page.params.carId;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${PUBLIC_BASE_URL}/api/car/${carId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      car = data.carDetails;
      dealer = data.dealerDetails.dealerInfo;
      dealerId = car.carInfo.dealerId;
      car.dealerName = `${dealer.firstname} ${dealer.lastname}`
    } catch (error) {
      console.log(error.response);
    }
  };

  onMount(getDetails);

  const buyCar = async () => {
    const carId = $page.params.carId;
    const token = localStorage.getItem("token");
    console.log(dealerId);
    try {
      const response = await fetch(
        `${PUBLIC_BASE_URL}/api/car/dealership/sold`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            carId,
            dealerId,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        isSold = data.message.isSold;
        toast.success(data.message);
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.response);
    }
  };
</script>

<!-- ------------------------------ -->
<main class="p-6">
  <h1 class="text-3xl font-semibold mb-4">Car Details</h1>
  {#if Object.keys(car).length > 0}
    <div class="lg:flex lg:items-center justify-center">
      <!-- Image displayed on the left -->
      <img
        src={car.carInfo.imageURL}
        alt={car.name}
        class="lg:w-2/5 lg:h-auto w-full rounded-lg mb-6 lg:mb-0"
      />

      <!-- Details displayed on the right -->
      <div class="p-5 lg:w-3/5 lg:ml-6">
        <h2 class="text-xl font-semibold mb-2">Type: {car.type}</h2>
        <p class="text-gray-600 mb-2">Name: {car.name}</p>
        <p class="text-gray-600 mb-2">Model: {car.model}</p>
        <p class="text-gray-600 mb-2">Engine: {car.carInfo.engine}</p>
        <p class="text-gray-600 mb-2">Fuel Type: {car.carInfo.fuelType}</p>
        <p class="text-gray-600 mb-2">
          Interior Color: {car.carInfo.interiorColor}
        </p>
        <p class="text-gray-600 mb-2">
          Exterior Color: {car.carInfo.exteriorColor}
        </p>
        <p class="text-gray-600 mb-2">Price: {car.carInfo.price}</p>
        <p class="text-gray-600 mb-2">Dealer: {car.dealerName}</p>

        {#if role === "buyer"}
          {#if !isSold}
            <button
              on:click={buyCar}
              class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              >Buy Now</button
            >
          {:else}
            <button
              class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              >Sold</button
            >
          {/if}
        {/if}
      </div>
    </div>
  {:else}
    <p>Loading...</p>
  {/if}
</main>
