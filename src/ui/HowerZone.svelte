<script lang="ts">
  import type { Task } from "../api/models";
  import { UnknownProject } from "../api/raw_models";
  import { focusedTodo } from "../stores";
  import moment from "moment";

  export let projects;
  export let todos: Task[] | [];
  export let x: number;
  export let y: number;
  export let width: number;
  export let height: number;
  let today = moment();

  console.log("zone", todos);

  const getUrgency = (dueDate) => {
    try {
      return (y + height / 2 + dueDate.diff(today, "days")) | 0;
    } catch {
      return y + height / 2;
    }
  };

  const getProjectDetails = (todo: string) => {
    let details = projects.get_or_default(todo, UnknownProject);
    return details;
  };

  function getColor(todoistColor) {
    switch (todoistColor) {
      case "sky_blue":
        return "blue";
      case "charcoal":
        return "black";
      default:
        return todoistColor;
    }
  }
</script>

<rect {x} {y} {width} {height} rx="15" stroke="black" stroke-width="5px" />
{#if todos.length > 0}
  {#each todos as todo, i}
    <circle
      cx={x + 30 * (i + 1)}
      cy={getUrgency(todo.rawDatetime)}
      r="20"
      fill={getColor(getProjectDetails(todo.projectID).color)}
      on:mouseover={() => ($focusedTodo = todo.content)}
      on:focus={getProjectDetails(todo.projectID)}
    />
    <text
      text-anchor="end"
      color="black"
      x={x + 30 * (i + 1)}
      y={getUrgency(todo.rawDatetime)}
      dy=".16em">{i}</text
    >
  {/each}
{/if}

<style>
  circle {
    /* fill: red; */
    opacity: 0.5;
  }
  text {
    color: black;
  }
</style>
