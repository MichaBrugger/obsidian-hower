<script lang="ts">
  import { onMount } from "svelte";
  import type { Task } from "../api/models";
  import HowerZone from "./HowerZone.svelte";
  import { focusedTodo } from "../stores";

  export let todos: Task[];
  export let projects;

  let width: number;
  let height: number;

  $: zoneWidth = width / 2;
  $: zoneHeight = height / 2;

  let getZoneTodos = (id: number): Task[] | [] => {
    return todos.filter((todo) => {
      return todo.priority === id;
    });
  };
  $: urgetTodos = todos.filter((todo) => {
    return todo.rawDatetime;
  });

  $: importantTodos = todos.filter((todo) => {
    return !todo.rawDatetime;
  });
</script>

<div class="focusedTodo">
  {$focusedTodo}
</div>
<div bind:clientWidth={width} bind:clientHeight={height} class="container">
  {#if width && height}
    <svg {width} {height}>
      <!-- <HowerZone -->
      <!--   x={0} -->
      <!--   y={0} -->
      <!--   width={zoneWidth} -->
      <!--   height={zoneHeight} -->
      <!--   todos={getZoneTodos(1)} -->
      <!-- /> -->
      <!-- <HowerZone -->
      <!--   x={zoneWidth} -->
      <!--   y={0} -->
      <!--   width={zoneWidth} -->
      <!--   height={zoneHeight} -->
      <!--   todos={getZoneTodos(2)} -->
      <!-- /> -->
      <!-- <HowerZone -->
      <!--   x={0} -->
      <!--   y={zoneHeight} -->
      <!--   width={zoneWidth} -->
      <!--   height={zoneHeight} -->
      <!--   todos={getZoneTodos(3)} -->
      <!-- /> -->
      <!-- <HowerZone -->
      <!--   x={zoneWidth} -->
      <!--   y={zoneHeight} -->
      <!--   width={zoneWidth} -->
      <!--   height={zoneHeight} -->
      <!--   todos={getZoneTodos(4)} -->
      <!-- /> -->
      <!-- <HowerZone {projects} x={0} y={0} {width} {height} {todos} /> -->

      <!-- <HowerZone -->
      <!--   {projects} -->
      <!--   x={zoneWidth} -->
      <!--   y={0} -->
      <!--   width={zoneWidth} -->
      <!--   {height} -->
      <!--   todos={importantTodos} -->
      <!-- /> -->
    </svg>
  {:else}
    <div>Loading</div>
  {/if}
</div>

<style>
  .container {
    width: 100%;
    height: 800px;
  }
  svg {
    /* fill: rgba(211, 211, 211, 0.5); */
    fill: transparent;
  }
  .focusedTodo {
    width: 100%;
    display: flex;
    margin-bottom: 4px;
    font-size: 1.2rem;
    font-weight: 600;
    justify-content: center;
  }
</style>
