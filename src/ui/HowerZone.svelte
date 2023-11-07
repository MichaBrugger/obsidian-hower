<!-- <script lang="ts"> -->
<!--   import { onMount } from "svelte"; -->
<!--   import type { Task } from "../api/models"; -->
<!--   import { UnknownProject } from "../api/raw_models"; -->
<!--   import { focusedTodo } from "../stores"; -->
<!--   import moment from "moment"; -->

<!--   export let projects; -->
<!--   export let todos: Task[] | []; -->
<!--   export let x: number; -->
<!--   export let y: number; -->
<!--   export let width: number; -->
<!--   export let height: number; -->
<!--   let today = moment(); -->
<!--   let updatedTodos: extendedTask[] | [] = []; -->

<!--   interface extendedTask extends Task { -->
<!--     index: number; -->
<!--     pos: { -->
<!--       cx: number; -->
<!--       cy: number; -->
<!--     }; -->
<!--     color: string; -->
<!--   } -->

<!--   onMount(() => { -->
<!--     const temp = todos.map((todo, index) => ({ -->
<!--       index: index, -->
<!--       pos: { -->
<!--         cx: x + 30 * (index + 1), -->
<!--         cy: getUrgency(todo.rawDatetime), -->
<!--       }, -->
<!--       color: getColor(getProjectDetails(todo.projectID).color), -->
<!--       ...todo, -->
<!--     })); -->
<!--     updatedTodos = temp; -->
<!--   }); -->

<!--   const getUrgency = (dueDate) => { -->
<!--     try { -->
<!--       return (y + height / 2 + dueDate.diff(today, "days")) | 0; -->
<!--       return y + height / 2; -->
<!--     } -->
<!--   }; -->

<!--   const getProjectDetails = (todo: string) => { -->
<!--     let details = projects.get_or_default(todo, UnknownProject); -->
<!--     return details; -->
<!--   }; -->

<!--   function getColor(todoistColor) { -->
<!--     switch (todoistColor) { -->
<!--       case "sky_blue": -->
<!--         return "blue"; -->
<!--       case "charcoal": -->
<!--         return "black"; -->
<!--       default: -->
<!--         return todoistColor; -->
<!--     } -->
<!--   } -->

<!--   function onTaskComplete(todo) { -->
<!--     console.log(todo); -->
<!--     $focusedTodo = undefined; -->
<!--   } -->

<!--   function bringToFront(hoveredTodo) { -->
<!--     updatedTodos = updatedTodos -->
<!--       .filter((t) => t !== hoveredTodo) -->
<!--       .concat(hoveredTodo); -->
<!--   } -->

<!--   function handleMouseOver(todo) { -->
<!--     if ($focusedTodo === undefined || $focusedTodo !== todo.content) { -->
<!--       $focusedTodo = todo.content; -->
<!--       bringToFront(todo); // Bring the hovered todo to the front -->
<!--     } -->
<!--   } -->
<!--   function handleMouseLeave() { -->
<!--     $focusedTodo = undefined; -->
<!--   } -->
<!-- </script> -->

<!-- <rect {x} {y} {width} {height} rx="15" stroke="black" stroke-width="5px" /> -->
<!-- {#if updatedTodos.length > 0} -->
<!--   {#each updatedTodos as todo} -->
<!--     <g -->
<!--       on:mouseover={() => handleMouseOver(todo)} -->
<!--       on:focus={getProjectDetails(todo.projectID)} -->
<!--       on:mouseleave={() => handleMouseLeave()} -->
<!--     > -->
<!--       <circle -->
<!--         cx={todo.pos.cx} -->
<!--         cy={todo.pos.cy} -->
<!--         r="20" -->
<!--         fill={todo.color} -->
<!--         on:focus={getProjectDetails(todo.projectID)} -->
<!--       /> -->
<!--       {#if $focusedTodo === todo.content} -->
<!--         <foreignObject -->
<!--           x={todo.pos.cx} -->
<!--           y={todo.pos.cy} -->
<!--           width="200" -->
<!--           height="100" -->
<!--           class="hover-menu-container" -->
<!--         > -->
<!--           <div class="hover-menu"> -->
<!--             <p>{todo.content}</p> -->
<!--             <button on:click={() => onTaskComplete(todo)}>Complete</button> -->
<!--           </div> -->
<!--         </foreignObject> -->
<!--       {/if} -->
<!--     </g> -->
<!--   {/each} -->
<!-- {/if} -->

<!-- <style> -->
<!--   circle { -->
<!--     opacity: 0.5; -->
<!--   } -->
<!--   .hover-menu { -->
<!--     background-color: white; -->
<!--     border: 1px solid #ccc; -->
<!--     border-radius: 4px; -->
<!--     padding: 10px; -->
<!--     box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2); -->
<!--     position: absolute; /* For HTML content, ensures it can be manipulated with z-index */ -->
<!--     z-index: 50; /* Ensures it's above the SVG elements in terms of stacking order */ -->
<!--     /* Adjust styles for your hover-menu */ -->
<!--   } -->
<!--   .hover-menu-container { -->
<!--     overflow: visible; /* Ensure the menu is not clipped by the foreignObject bounds */ -->
<!--   } -->
<!-- </style> -->
