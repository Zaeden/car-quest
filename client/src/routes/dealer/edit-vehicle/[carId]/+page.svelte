<script>
  import { page } from "$app/stores";
  import { PUBLIC_BASE_URL } from "$env/static/public";
  import { onMount } from "svelte";

  let carData = {
    type: "",
    name: "",
    model: "",
    engine: "",
    fuelType: "",
    interiorColor: "",
    exteriorColor: "",
    imageURL: "",
    price: "",
  };

  const carId = $page.params.carId;

  const getDetails = async () => {
    // const carId = $page.params.carId;
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
      carData = data.carDetails;
      carData.engine = data.carDetails.carInfo.engine;
      carData.fuelType = data.carDetails.carInfo.fuelType;
      carData.interiorColor = data.carDetails.carInfo.interiorColor;
      carData.exteriorColor = data.carDetails.carInfo.exteriorColor;
      carData.price = data.carDetails.carInfo.price;
      console.log(carData);
    } catch (error) {
      console.log(error.response);
    }
  };

  onMount(getDetails);

  async function updateCar() {
    console.log("Update Clicked");
    try {
      const fileInput = document.getElementById("fileInput");
      const formData = new FormData();
      if (fileInput.files.length) {
        const file = fileInput.files[0];
        formData.append("file", file);
        formData.append("upload_preset", "socially");
        formData.append("cloud_name", "dvkdfcjpu");

        const imageResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dvkdfcjpu/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (imageResponse.ok) {
          const cloudinaryData = await imageResponse.json();

          carData.imageURL = cloudinaryData.url;
        }

        const token = localStorage.getItem("token");
        const response = await fetch(`${PUBLIC_BASE_URL}/api/car/${carId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(carData),
        });

        const data = await response.json();
        carData = {
          type: "",
          name: "",
          model: "",
          engine: "",
          fuelType: "",
          interiorColor: "",
          exteriorColor: "",
          imageURL: "",
          price: "",
        };
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
</script>

<div class="max-w-md mx-auto p-4 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-4">Edit Car Details</h1>
  <form on:submit|preventDefault={updateCar} class="space-y-4">
    <input
      type="text"
      bind:value={carData.type}
      placeholder="Type"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" required
    />
    <input
      type="text"
      bind:value={carData.name}
      placeholder="Name"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" required
    />
    <input
      type="number"
      bind:value={carData.model}
      placeholder="Model"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" required
    />
    <input
      type="text"
      bind:value={carData.engine}
      placeholder="Engine"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" required
    />
    <input
      type="text"
      bind:value={carData.fuelType}
      placeholder="Fuel Type"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" required
    />
    <input
      type="text"
      bind:value={carData.interiorColor}
      placeholder="Interior Color"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" required
    />
    <input
      type="text"
      bind:value={carData.exteriorColor}
      placeholder="Exterior Color"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" required
    />

    <input
      type="number"
      bind:value={carData.price}
      placeholder="Price"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" required
    />

    <input
      id="fileInput"
      type="file"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" required
    />

    <button
      type="submit"
      class="w-full mb-4 bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >Update Car Details</button
    >
  </form>
</div>
