<script>
  import Calendar from "@event-calendar/core";
  import List from "@event-calendar/list";

  export let scheduled;
  let list;
  let plugins = [List];
  let options = {
    view: "listDay",
    headerToolbar: {
      start: "",
      center: "",
      end: "",
    },
    eventSources: [
      {
        events: function () {
          return events;
        },
      },
    ],
  };

  $: events = scheduled.map((todo) => ({
    id: todo.id,
    title: todo.content,
    start: moment(todo.rawDatetime).toISOString(true),
    end: moment(todo.rawDatetime)
      .add(todo.duration.amount, "m")
      .toISOString(true),
  }));
</script>

<div class="container">
  {#if events && events.length > 0}
    <Calendar {plugins} {options} bind:this={list} />
  {/if}
</div>

<style>
  .container {
    flex: 1;
  }
</style>
