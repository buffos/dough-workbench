<script lang="ts">
  export let label: string;
  export let help: string;
  export let helpId: string;
  export let wide = false;

  let open = false;

  function toggle(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    open = !open;
  }

  function handleWindowKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') open = false;
  }
</script>

<svelte:window on:keydown={handleWindowKeydown} />

<span class:field-help-wide={wide} class="field-help-label">
  <span class="field-help-text">{label}</span>
  <button
    type="button"
    class="field-help-trigger"
    aria-label={`${label}: ${help}`}
    aria-expanded={open}
    aria-controls={helpId}
    title={help}
    on:click={toggle}
  >?</button>
  <span id={helpId} class:field-help-visible={open} class="field-help-popover" role="tooltip">{help}</span>
</span>

<style>
  .field-help-label {
    position: relative;
    display: inline-flex;
    max-width: 100%;
    align-items: baseline;
    gap: 0.28rem;
    color: inherit;
    font: inherit;
    line-height: 1.25;
    color: #5d6a61;
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .field-help-wide {
    width: 100%;
  }

  .field-help-text {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .field-help-trigger {
    display: inline-grid;
    flex: 0 0 auto;
    align-self: flex-end;
    width: 1rem;
    height: 1rem;
    padding: 0;
    place-items: center;
    border: 1px solid currentColor;
    border-radius: 50%;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 0.68rem;
    font-weight: 800;
    line-height: 1;
    cursor: help;
  }

  .field-help-trigger:hover,
  .field-help-trigger:focus-visible {
    background: #33463d;
    color: #fffdfa;
    outline: 2px solid rgba(184, 120, 89, 0.3);
    outline-offset: 2px;
  }

  .field-help-popover {
    position: absolute;
    z-index: 30;
    top: calc(100% + 0.45rem);
    left: 0;
    display: none;
    width: min(22rem, calc(100vw - 2rem));
    padding: 0.65rem 0.75rem;
    border: 1px solid rgba(51, 70, 61, 0.28);
    border-radius: 0.2rem;
    background: #33463d;
    box-shadow: 0 0.5rem 1.2rem rgba(39, 48, 42, 0.18);
    color: #fffdfa;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: normal;
    line-height: 1.45;
    text-align: left;
    text-transform: none;
    white-space: normal;
  }

  .field-help-label:hover .field-help-popover,
  .field-help-trigger:focus-visible + .field-help-popover,
  .field-help-popover.field-help-visible {
    display: block;
  }

  @media (max-width: 720px) {
    .field-help-popover {
      position: fixed;
      top: auto;
      right: 1rem;
      bottom: 1rem;
      left: 1rem;
      width: auto;
    }
  }
</style>
