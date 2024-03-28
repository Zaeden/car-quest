<script>
  import { PUBLIC_BASE_URL } from "$env/static/public";

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

  async function addCar() {
    try {
      const fileInput = document.getElementById("fileInput");
      const file = fileInput.files[0];
      const formData = new FormData();
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

        const token = localStorage.getItem("token");
        const response = await fetch(`${PUBLIC_BASE_URL}/api/car/dealership`, {
          method: "POST",
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
  <h1 class="text-2xl font-bold mb-4">Add Car</h1>
  <form on:submit|preventDefault={addCar} class="space-y-4">
    <!-- Input fields for car details -->
    <input
      type="text"
      bind:value={carData.type}
      placeholder="Type"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      required
    />
    <input
      type="text"
      bind:value={carData.name}
      placeholder="Name"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      required
    />
    <input
      type="number"
      bind:value={carData.model}
      placeholder="Model"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      required
    />
    <input
      type="text"
      bind:value={carData.engine}
      placeholder="Engine"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      required
    />
    <input
      type="text"
      bind:value={carData.fuelType}
      placeholder="Fuel Type"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      required
    />
    <input
      type="text"
      bind:value={carData.interiorColor}
      placeholder="Interior Color"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      required
    />
    <input
      type="text"
      bind:value={carData.exteriorColor}
      placeholder="Exterior Color"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      required
    />

    <input
      type="number"
      bind:value={carData.price}
      placeholder="Price"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      required
    />

    <input
      id="fileInput"
      type="file"
      class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      required
    />

    <button
      type="submit"
      class="w-full mb-4 bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >Add Car</button
    >
  </form>
</div>
