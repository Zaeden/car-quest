<script>
  import "../app.css";
  import Header from "../components/Header.svelte";
  import {Toaster} from "svelte-french-toast";

</script>

<Toaster />
<Header />
<slot />
