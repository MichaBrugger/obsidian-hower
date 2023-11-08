<script lang="ts">
  import { fade } from "svelte/transition";
  import type { ITodoistMetadata, TodoistApi } from "../api/api";
  import type { Task } from "../api/models";
  import {
    UnknownProject,
    UnknownSection,
    type IProjectRaw,
  } from "../api/raw_models";
  import CalendarIcon from "../components/icons/CalendarIcon.svelte";
  import LabelIcon from "../components/icons/LabelIcon.svelte";
  import ProjectIcon from "../components/icons/ProjectIcon.svelte";
  import MarkdownRenderer from "../components/MarkdownRenderer.svelte";
  import { showTaskContext } from "../contextMenu";
  import type { ISettings } from "../settings";
  import DescriptionRenderer from "./DescriptionRenderer.svelte";
  import TaskList from "./TaskList.svelte";
  import { focusedTodo, width, height } from "../stores";
  import moment from "moment";

  export let metadata: ITodoistMetadata;
  export let settings: ISettings;
  export let api: TodoistApi;
  export let sorting: string[];
  export let renderProject: boolean;
  export let onClickTask: (task: Task) => Promise<void>;
  export let bringToFront: (task: Task) => void;
  export let todo: Task;
  // export let height;
  // export let width;
  let today = moment();

  $: isCompletable = !todo.content.startsWith("*");
  // $: priorityClass = getPriorityClass(todo.priority);
  $: dateTimeClass = getDateTimeClass(todo);
  // $: projectLabel = getProjectLabel(todo, metadata);
  $: labels = todo.labels.join(", ");
  $: sanitizedContent = sanitizeContent(todo.content);

  function sanitizeContent(content: string): string {
    // Escape leading '#' or '-' so they aren't rendered as headers/bullets.
    if (content.startsWith("#") || content.startsWith("-")) {
      return `\\${content}`;
    }

    // A task starting with '*' signifies that it cannot be completed, so we should strip it from the front of the task.
    if (content.startsWith("*")) {
      return content.substring(1);
    }

    return content;
  }

  // For some reason, the Todoist API returns priority in reverse order from
  // the p1/p2/p3/p4 fluent entry notation.
  function getPriorityClass(priority: number): string {
    switch (priority) {
      case 1:
        return "todoist-p4";
      case 2:
        return "todoist-p3";
      case 3:
        return "todoist-p2";
      case 4:
        return "todoist-p1";
    }
  }

  function getDateTimeClass(todo: Task): string {
    const parts = [];

    if (todo.hasTime) {
      parts.push("has-time");
    } else {
      parts.push("no-time");
    }

    if (todo.isOverdue()) {
      parts.push("task-overdue");
    } else if (todo.isToday()) {
      parts.push("task-today");
    }

    return parts.join(" ");
  }

  function onClickTaskContainer(evt: MouseEvent) {
    evt.stopPropagation();
    evt.preventDefault();

    showTaskContext(
      {
        task: todo,
        onClickTask: onClickTask,
      },
      {
        x: evt.pageX,
        y: evt.pageY,
      }
    );
  }

  const getUrgency = (dueDate) => {
    try {
      return ($height / 2 + dueDate.diff(today, "days") * 1.5) | 0;
    } catch (e) {
      return $height / 2;
    }
  };

  function handleMouseOver(todo) {
    if ($focusedTodo === undefined || $focusedTodo !== todo.content) {
      $focusedTodo = todo.content;
      bringToFront(todo);
    }
  }

  function handleMouseLeave() {
    $focusedTodo = undefined;
  }
</script>

<g
  on:mouseover={() => handleMouseOver(todo)}
  on:mouseleave={() => handleMouseLeave()}
  on:focus={() => console.log(todo)}
>
  <circle
    cx={100 + (todo.order + 1) * 10}
    cy={getUrgency(todo.rawDatetime)}
    r="10"
    fill="red"
  />
  {#if $focusedTodo === todo.content}
    <foreignObject
      x={100 + (todo.order + 1) * 10}
      y={getUrgency(todo.rawDatetime)}
      width="200"
      height="100"
      class="hover-menu-container"
    >
      <div class="hover-menu">
        <h2>{todo.getProjectLabel(metadata)}</h2>
        <p>{todo.content}</p>
        <button
          on:click|preventDefault={async () => {
            await onClickTask(todo);
          }}>Complete</button
        >
      </div>
    </foreignObject>
  {/if}
</g>

<style>
  circle {
    opacity: 0.5;
  }
  .hover-menu {
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
    position: absolute; /* For HTML content, ensures it can be manipulated with z-index */
    z-index: 50; /* Ensures it's above the SVG elements in terms of stacking order */
    /* Adjust styles for your hover-menu */
  }
  .hover-menu-container {
    overflow: visible; /* Ensure the menu is not clipped by the foreignObject bounds */
  }
</style>
