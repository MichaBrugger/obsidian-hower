<script lang="ts">
  import { Notice } from "obsidian";
  import { onDestroy } from "svelte";
  import type { TodoistApi, ITodoistMetadata } from "../api/api";
  import type { Task, ID } from "../api/models";
  import type { ISettings } from "../settings";
  import NoTaskDisplay from "./NoTaskDisplay.svelte";
  import TaskRenderer from "./TaskRenderer.svelte";
  import HowerDisplay from "./HowerDisplay.svelte";
  import { UnknownProject } from "../api/raw_models";
  import { focusedTodo, todos } from "../stores";

  export let tasks: Task[];
  export let settings: ISettings;
  export let api: TodoistApi;
  export let sorting: string[];
  export let renderProject: boolean = true;
  export let renderNoTaskInfo: boolean = true;
  let tasksPendingClose: ID[] = [];
  let width: number;
  let height: number;

  let metadata: ITodoistMetadata = null;
  const metadataUnsub = api.metadata.subscribe((value) => (metadata = value));

  $: $todos = tasks
    .filter((task) => !tasksPendingClose.includes(task.id))
    .sort((first: Task, second: Task) => first.compareTo(second, sorting));

  onDestroy(() => {
    metadataUnsub();
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

<div bind:clientWidth={width} bind:clientHeight={height} class="container">
  {#if $todos.length != 0}
    {#if width && height}
      <svg {width} {height}>
        {#each $todos as todo, index}
          <TaskRenderer
            {onClickTask}
            {bringToFront}
            {metadata}
            {settings}
            {api}
            {sorting}
            {renderProject}
            {todo}
            {index}
            {height}
            {width}
          />
        {/each}
      </svg>
    {/if}
  {:else if renderNoTaskInfo}
    <NoTaskDisplay />
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
