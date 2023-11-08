<script>
  import { width, height } from "../stores";
</script>

<div width={$width / 3} class="pipeline">...</div>

<style>
  .pipeline {
    display: flex;
    flex: 1;
    background-color: gray;
    margin: 0 20px;
  }
</style>
