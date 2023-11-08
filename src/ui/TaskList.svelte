<script lang="ts">
  import { Notice } from "obsidian";
  import { onDestroy } from "svelte";
  import type { TodoistApi, ITodoistMetadata } from "../api/api";
  import type { Task, ID } from "../api/models";
  import type { ISettings } from "../settings";
  import NoTaskDisplay from "./NoTaskDisplay.svelte";
  import TaskRenderer from "./TaskRenderer.svelte";
  import { UnknownProject } from "../api/raw_models";
  import { todos, width, height } from "../stores";
  import Calendar from "./Calendar.svelte";
  import Pipeline from "./Pipeline.svelte";
  import List from "./List.svelte";

  export let tasks: Task[];
  export let settings: ISettings;
  export let api: TodoistApi;
  export let sorting: string[];
  export let renderProject: boolean = true;
  export let renderNoTaskInfo: boolean = true;
  let tasksPendingClose: ID[] = [];

  let metadata: ITodoistMetadata = null;
  const metadataUnsub = api.metadata.subscribe((value) => (metadata = value));

  $: $todos = tasks
    .filter((task) => !tasksPendingClose.includes(task.id))
    .sort((first: Task, second: Task) => first.compareTo(second, sorting));

  onDestroy(() => {
    metadataUnsub();
  });

  $: scheduled = $todos.filter((todo) => {
    if (todo.duration) {
      return todo;
    }
  });

  async function onClickTask(task: Task) {
    tasksPendingClose.push(task.id);
    tasksPendingClose = tasksPendingClose;

    if (await api.closeTask(task.id)) {
      tasks = tasks.filter((otherTask) => otherTask.id !== task.id);
    } else {
      new Notice("Failed to close task", 2000);
    }

    tasksPendingClose = tasksPendingClose.filter((id) => id !== task.id);
  }

  function bringToFront(todo) {
    $todos = $todos.filter((t) => t !== todo).concat(todo);
  }
</script>

<div bind:clientWidth={$width} bind:clientHeight={$height} class="container">
  {#if $todos.length != 0}
    {#if $width > 0 && $height > 0}
      <div class="calendar">
        <Calendar {scheduled} />
        <List {scheduled} />
      </div>
      <div class="map">
        <svg width={$width / 2} height={$height}>
          {#each $todos as todo}
            <TaskRenderer
              {onClickTask}
              {bringToFront}
              {metadata}
              {settings}
              {api}
              {sorting}
              {renderProject}
              {todo}
            />
          {/each}
        </svg>
      </div>
    {/if}
  {:else if renderNoTaskInfo}
    <NoTaskDisplay />
  {/if}
</div>

<style>
  .container {
    width: 100%;
    height: 800px;
    display: flex;
    gap: 20px;
  }
  .calendar {
    border: 1px dotted black;
    width: 45%;
    display: flex;
    /* flex: 1; */
    gap: 20px;
  }
  svg {
    /* fill: rgba(211, 211, 211, 0.5); */
    fill: transparent;
  }
  .map {
    border: 1px dotted black;
  }
</style>
