<script>
  import Calendar from "@event-calendar/core";
  import TimeGrid from "@event-calendar/time-grid";
  import moment from "moment";

  export let scheduled;

  let cal;
  let plugins = [TimeGrid];
  let options = {
    view: "timeGridDay",
    duration: { days: 2 },
    headerToolbar: {
      start: "",
      center: "",
      end: "",
    },
    allDaySlot: false,
    height: "1000px",
    slotMinTime: "08:00",
    slotMaxTime: "22:00",
    slotDuration: "00:30",
    eventMouseEnter: (i) => onEventMouseOver(i),
    eventSources: [
      {
        events: function () {
          return events;
        },
      },
    ],
  };

  $: console.log(events);
  $: console.log(scheduled);
  $: events = scheduled.map((todo) => ({
    id: todo.id,
    title: todo.content,
    start: moment(todo.rawDatetime).toISOString(true),
    end: moment(todo.rawDatetime)
      .add(todo.duration.amount, "m")
      .toISOString(true),
  }));

  function onEventMouseOver(content) {
    updateOptions();
    console.log(content);
  }

  function updateOptions() {
    // options.slotDuration = "00:15";
  }
</script>

<div class="container">
  {#if events && events.length > 0}
    <Calendar {plugins} {options} bind:this={cal} />
  {/if}
</div>

<style>
  .container {
    flex: 2;
  }
</style>
