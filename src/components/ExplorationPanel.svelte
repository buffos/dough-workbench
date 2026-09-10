<script lang="ts">
  import {
    COMPOSITION_FIELDS,
    INGREDIENT_ROLES,
    type FormulaDraft,
  } from '../lib/domain/types';
  import {
    PROCESS_FIELD_DESCRIPTORS,
    type ProcessDraft,
    type ProcessFieldDescriptor,
  } from '../lib/domain/process';
  import {
    readExplorationPath,
    type ComparisonResult,
    type CounterfactualScenario,
    type ExplorationAnalysisSnapshot,
    type ExplorationDiagnostic,
    type ExplorationPatchValue,
    type ExplorationOwner,
    type PatchInput,
  } from '../lib/domain/exploration';
  import { t, type Locale } from '../lib/i18n/messages';
  import FieldHelp from './FieldHelp.svelte';

  export let locale: Locale;
  export let formula: FormulaDraft;
  export let process: ProcessDraft;
  export let analysis: ExplorationAnalysisSnapshot | null = null;
  export let scenario: CounterfactualScenario | null = null;
  export let comparison: ComparisonResult | null = null;
  export let patchError: ExplorationDiagnostic | null = null;
  export let baselineError: ExplorationDiagnostic | null = null;
  export let formulaFlourLabel: (id: string) => string = (id) => id;
  export let formulaIngredientLabel: (id: string) => string = (id) => id;
  export let onStart: () => void = () => {};
  export let onAddPatch: (input: PatchInput) => void = () => {};
  export let onEvaluate: () => void = () => {};
  export let onReset: () => void = () => {};

  type TargetControl = 'number' | 'enum' | 'text';
  type PatchState = 'known' | 'unknown' | 'none';

  interface TargetOption {
    path: string;
    owner: ExplorationOwner;
    label: string;
    control: TargetControl;
    options: readonly string[];
    stateful: boolean;
    min?: number;
    max?: number;
    unit?: string;
    descriptor?: ProcessFieldDescriptor;
  }

  let selectedPath = '';
  let selectedState: PatchState = 'known';
  let inputValue = '';
  let targetOptions: TargetOption[] = [];
  let selectedTarget: TargetOption | null = null;

  function processOptionLabel(value: string): string {
    return t(locale, `process.enum.${value}`);
  }

  function processTargetLabel(field: ProcessFieldDescriptor, currentLocale: Locale): string {
    const [section] = field.path.split('.');
    const unit = field.unit ? ` (${t(currentLocale, `process.unit.${field.unit}`)})` : '';
    return `${t(currentLocale, `process.section.${section}`)} · ${t(currentLocale, `process.field.${field.key}`)}${unit}`;
  }

  function formulaTargetLabel(name: string, field: string, currentLocale: Locale): string {
    return `${name} · ${t(currentLocale, `field.${field}`)}`;
  }

  function buildTargetOptions(
    currentFormula: FormulaDraft,
    currentLocale: Locale,
    currentFlourLabel: (id: string) => string,
    currentIngredientLabel: (id: string) => string,
  ): TargetOption[] {
    const flourTargets = currentFormula.flourComponents.flatMap((flour) => [
      {
        path: `formula.flourComponents.${flour.id}.massGrams`,
        owner: 'formula' as const,
        label: formulaTargetLabel(currentFlourLabel(flour.id), 'mass', currentLocale),
        control: 'number' as const,
        options: [],
        stateful: false,
        min: 0,
        unit: 'g',
      },
      ...COMPOSITION_FIELDS.map((field) => ({
        path: `formula.flourComponents.${flour.id}.composition.${field}`,
        owner: 'formula' as const,
        label: formulaTargetLabel(currentFlourLabel(flour.id), field, currentLocale),
        control: 'number' as const,
        options: [],
        stateful: true,
        min: 0,
        max: 100,
        unit: '%',
      })),
    ]);
    const ingredientTargets = currentFormula.ingredientLines.flatMap((line) => [
      {
        path: `formula.ingredientLines.${line.id}.massGrams`,
        owner: 'formula' as const,
        label: formulaTargetLabel(currentIngredientLabel(line.id), 'mass', currentLocale),
        control: 'number' as const,
        options: [],
        stateful: false,
        min: 0,
        unit: 'g',
      },
      {
        path: `formula.ingredientLines.${line.id}.role`,
        owner: 'formula' as const,
        label: formulaTargetLabel(currentIngredientLabel(line.id), 'role', currentLocale),
        control: 'enum' as const,
        options: INGREDIENT_ROLES,
        stateful: false,
      },
      ...COMPOSITION_FIELDS.map((field) => ({
        path: `formula.ingredientLines.${line.id}.composition.${field}`,
        owner: 'formula' as const,
        label: formulaTargetLabel(currentIngredientLabel(line.id), field, currentLocale),
        control: 'number' as const,
        options: [],
        stateful: true,
        min: 0,
        max: 100,
        unit: '%',
      })),
      {
        path: `formula.ingredientLines.${line.id}.availabilityOverride`,
        owner: 'formula' as const,
        label: `${currentIngredientLabel(line.id)} · ${t(currentLocale, 'ingredient.availabilityOverride')}`,
        control: 'number' as const,
        options: [],
        stateful: true,
        min: 0,
        max: 1,
        unit: '0–1',
      },
    ]);
    const processTargets = PROCESS_FIELD_DESCRIPTORS.map((field) => ({
      path: `process.${field.path}`,
      owner: 'process' as const,
      label: processTargetLabel(field, currentLocale),
      control: field.kind === 'number' ? 'number' as const : field.kind === 'enum' || field.kind === 'boolean' || field.kind === 'reference' ? 'enum' as const : 'text' as const,
      options: field.reference === 'formula-line'
        ? currentFormula.ingredientLines.map((line) => line.id)
        : field.options ?? [],
      stateful: true,
      min: field.min,
      max: field.max,
      unit: field.unit ? t(currentLocale, `process.unit.${field.unit}`) : undefined,
      descriptor: field,
    }));
    return [...flourTargets, ...ingredientTargets, ...processTargets];
  }

  function syncSelectedTarget(): void {
    if (!scenario || !selectedTarget) return;
    const current = readExplorationPath(scenario, selectedTarget.path);
    if (!current) return;
    selectedState = current.state;
    inputValue = current.state === 'known'
      ? Array.isArray(current.value) ? current.value.join(', ') : String(current.value)
      : '';
  }

  function valueState(value: PatchState): ExplorationPatchValue {
    if (value === 'none') return { state: 'none' };
    if (value === 'unknown') return { state: 'unknown', reasonCode: 'user-left-unrecorded' };
    return {
      state: 'known',
      value: inputValue,
      provenance: { kind: 'user-entered', sourceId: 'counterfactual-exploration' },
      confidence: 1,
    };
  }

  function addPatch(): void {
    if (!scenario || !selectedTarget) return;
    onAddPatch({
      patchId: `exploration-patch-${scenario.revision}-${Date.now()}`,
      owner: selectedTarget.owner,
      path: selectedTarget.path,
      after: valueState(selectedTarget.stateful ? selectedState : 'known'),
    });
  }

  function selectTarget(path: string): void {
    selectedPath = path;
  }

  function formatNumber(value: number): string {
    return new Intl.NumberFormat(locale === 'el' ? 'el-GR' : 'en-US', { maximumFractionDigits: 3 }).format(value);
  }

  function stateLabel(state: PatchState): string {
    return t(locale, `state.${state}`);
  }

  function patchValue(value: ExplorationPatchValue): string {
    if (value.state === 'known') return Array.isArray(value.value) ? value.value.join(', ') : String(value.value);
    return stateLabel(value.state);
  }

  function targetLabel(path: string): string {
    return targetOptions.find((target) => target.path === path)?.label ?? path;
  }

  function optionLabel(target: TargetOption, value: string): string {
    if (target.descriptor?.reference === 'formula-line') return formulaIngredientLabel(value);
    if (target.path.endsWith('.role')) return t(locale, `role.${value}`);
    return processOptionLabel(value);
  }

  function comparisonOutcomeLabel(outcome: ComparisonResult['outcome']): string {
    if (outcome === 'completed') return t(locale, 'status.completed');
    if (outcome === 'partial') return t(locale, 'status.partial');
    if (outcome === 'conflict') return t(locale, 'analysis.handoff.outcome.conflict');
    return t(locale, 'status.rejected');
  }

  function metricLabel(metric: ComparisonResult['metricChanges'][number]): string {
    return t(locale, `${metric.family === 'intrinsic' ? 'intrinsic.metric' : 'effective.metric'}.${metric.metricKey}`);
  }

  function metricStatusLabel(status: ComparisonResult['metricChanges'][number]['status']): string {
    return t(locale, `exploration.metric.status.${status}`);
  }

  function metricValue(value: number | undefined, unit: string): string {
    return value === undefined ? t(locale, 'exploration.metric.noValue') : `${formatNumber(value)} ${unit}`;
  }

  function revisionAfter(value: number | undefined, fallback: number): string {
    return value === undefined ? String(fallback) : String(value);
  }

  $: targetOptions = buildTargetOptions(formula, locale, formulaFlourLabel, formulaIngredientLabel);
  $: if (!targetOptions.some((target) => target.path === selectedPath)) selectedPath = targetOptions[0]?.path ?? '';
  $: selectedTarget = targetOptions.find((target) => target.path === selectedPath) ?? null;
  $: if (scenario && selectedTarget) syncSelectedTarget();
</script>

<section class="exploration-panel" aria-labelledby="exploration-title">
  <div class="exploration-heading">
    <div>
      <span class="exploration-kicker">{t(locale, 'exploration.kicker')}</span>
      <h3 id="exploration-title">{t(locale, 'exploration.title')}</h3>
    </div>
    {#if scenario}
      <span class={`exploration-status ${scenario.status}`}>
        <span class="status-dot" aria-hidden="true"></span>{t(locale, `exploration.status.${scenario.status}`)}
      </span>
    {/if}
  </div>
  <p class="exploration-intro">{t(locale, 'exploration.intro')}</p>

  {#if !scenario}
    {#if !analysis?.handoff.data}
      <div class="exploration-empty" role="status">
        <strong>{t(locale, 'exploration.analysisNeeded')}</strong>
      </div>
      {#if baselineError}
        <div class="exploration-error" role="alert">
          <strong>{t(locale, baselineError.messageKey, baselineError.parameters)}</strong>
          <p>{t(locale, baselineError.resolutionKey, baselineError.parameters)}</p>
        </div>
      {/if}
    {:else}
      <div class="exploration-start-row">
        <div>
          <strong>{t(locale, 'exploration.baseline')}</strong>
          <p>{t(locale, 'exploration.baselineNote')}</p>
        </div>
        <button type="button" class="exploration-button primary" on:click={() => onStart()}>
          {t(locale, 'exploration.start')} <span aria-hidden="true">→</span>
        </button>
      </div>
    {/if}
  {:else}
    <div class="baseline-card">
      <div>
        <span class="card-label">{t(locale, 'exploration.baseline')}</span>
        <strong>{t(locale, 'exploration.patchCount.other', { count: scenario.patches.length })}</strong>
      </div>
      <p>{t(locale, 'exploration.baselineNote')}</p>
      <div class="baseline-facts">
        <span>{t(locale, 'exploration.evidence.formulaRevision')}: <strong>{scenario.baseline.formulaRevision}</strong></span>
        <span>{t(locale, 'exploration.evidence.processRevision')}: <strong>{scenario.baseline.processRevision}</strong></span>
        <span>{t(locale, 'exploration.evidence.coverage')}: <strong>{Math.round(scenario.baseline.snapshot.handoff.coverage.composition * 100)}% / {Math.round(scenario.baseline.snapshot.handoff.coverage.process * 100)}%</strong></span>
      </div>
    </div>

    <div class="change-editor">
      <div class="subheading-row">
        <div>
          <span class="card-label">{t(locale, 'exploration.change')}</span>
          <h4>{t(locale, 'exploration.changeTarget')}</h4>
        </div>
      </div>
      <div class="change-grid">
        <label class="exploration-field target-field">
          <FieldHelp
            label={t(locale, 'exploration.changeTarget')}
            help={t(locale, 'help.exploration.changeTarget')}
            helpId="help-exploration-change-target"
            wide
          />
          <select aria-label={t(locale, 'exploration.changeTarget')} value={selectedPath} on:change={(event) => selectTarget((event.currentTarget as HTMLSelectElement).value)}>
            {#each targetOptions as target (target.path)}
              <option value={target.path}>{target.owner === 'formula' ? t(locale, 'exploration.owner.formula') : t(locale, 'exploration.owner.process')} · {target.label}</option>
            {/each}
          </select>
        </label>

        <label class="exploration-field state-field">
          <span>{t(locale, 'exploration.changeState')}</span>
          <select
            aria-label={t(locale, 'exploration.changeState')}
            value={selectedTarget?.stateful ? selectedState : 'known'}
            disabled={!selectedTarget?.stateful}
            on:change={(event) => {
              selectedState = (event.currentTarget as HTMLSelectElement).value as PatchState;
              if (selectedState !== 'known') inputValue = '';
            }}
          >
            <option value="known">{t(locale, 'exploration.changeKnown')}</option>
            <option value="unknown">{t(locale, 'exploration.changeUnknown')}</option>
            <option value="none">{t(locale, 'exploration.changeNone')}</option>
          </select>
        </label>

        {#if selectedTarget?.stateful ? selectedState === 'known' : true}
          <label class="exploration-field value-field">
            <span>{t(locale, 'exploration.changeValue')}{selectedTarget?.unit ? ` (${selectedTarget.unit})` : ''}</span>
            {#if selectedTarget?.control === 'enum'}
              <select aria-label={t(locale, 'exploration.changeValue')} value={inputValue} on:change={(event) => (inputValue = (event.currentTarget as HTMLSelectElement).value)}>
                <option value="">{t(locale, 'exploration.changeValuePlaceholder')}</option>
                {#each selectedTarget.options as option (option)}
                  <option value={option}>{optionLabel(selectedTarget, option)}</option>
                {/each}
              </select>
            {:else}
              <input
                type={selectedTarget?.control === 'number' ? 'number' : 'text'}
                aria-label={t(locale, 'exploration.changeValue')}
                placeholder={t(locale, 'exploration.changeValuePlaceholder')}
                min={selectedTarget?.min}
                max={selectedTarget?.max}
                step={selectedTarget?.unit === '%' ? '0.1' : 'any'}
                value={inputValue}
                on:input={(event) => (inputValue = (event.currentTarget as HTMLInputElement).value)}
              />
            {/if}
          </label>
        {/if}
      </div>
      <button type="button" class="exploration-button secondary" disabled={!selectedTarget || (selectedState === 'known' && !inputValue.trim())} on:click={addPatch}>
        + {t(locale, 'exploration.addChange')}
      </button>
    </div>

    {#if patchError}
      <div class="exploration-error" role="alert" aria-live="polite">
        <strong>{t(locale, patchError.messageKey, patchError.parameters)}</strong>
        <p>{t(locale, patchError.resolutionKey, patchError.parameters)}</p>
      </div>
    {/if}

    <div class="patch-list">
      <div class="list-heading">
        <h4>{t(locale, 'exploration.patches')}</h4>
        <span>{t(locale, scenario.patches.length === 1 ? 'exploration.patchCount.one' : 'exploration.patchCount.other', { count: scenario.patches.length })}</span>
      </div>
      {#if scenario.patches.length === 0}
        <p class="exploration-empty">{t(locale, 'exploration.emptyPatches')}</p>
      {:else}
        {#each scenario.patches as patch (patch.patchId)}
          <article class="patch-row">
            <div>
              <span class={`owner-badge ${patch.owner}`}>{patch.owner === 'formula' ? t(locale, 'exploration.owner.formula') : t(locale, 'exploration.owner.process')}</span>
              <strong>{targetLabel(patch.path)}</strong>
            </div>
            <div class="patch-values">
              <span>{patchValue(patch.before)}</span><span aria-hidden="true">→</span><strong>{patchValue(patch.after)}</strong>
            </div>
          </article>
        {/each}
      {/if}
    </div>

    <div class="exploration-actions">
      <button type="button" class="exploration-button primary" on:click={() => onEvaluate()}>
        {t(locale, 'exploration.evaluate')} <span aria-hidden="true">→</span>
      </button>
      <button type="button" class="exploration-button quiet" on:click={() => onReset()}>{t(locale, 'exploration.reset')}</button>
    </div>

    {#if comparison}
      <div class={`comparison-card ${comparison.outcome}`} aria-live="polite">
        <div class="comparison-heading">
          <div>
            <span class="card-label">{t(locale, 'exploration.result')}</span>
            <h4>{comparisonOutcomeLabel(comparison.outcome)}</h4>
          </div>
          <span class="outcome-chip">{t(locale, `exploration.patchCount.${scenario.patches.length === 1 ? 'one' : 'other'}`, { count: scenario.patches.length })}</span>
        </div>
        <p class="comparison-intro">{t(locale, 'exploration.resultIntro')}</p>

        {#if comparison.counterfactual}
          <div class="comparison-columns">
            <div class="comparison-column baseline-column">
              <span class="column-label">{t(locale, 'exploration.baseline')}</span>
              <strong>{t(locale, 'exploration.evidence.formulaRevision')} {comparison.evidence.formulaRevision.before} · {t(locale, 'exploration.evidence.processRevision')} {comparison.evidence.processRevision.before}</strong>
            </div>
            <div class="comparison-column scenario-column">
              <span class="column-label">{t(locale, 'exploration.status.evaluated')}</span>
              <strong>{t(locale, 'exploration.evidence.formulaRevision')} {revisionAfter(comparison.evidence.formulaRevision.after, comparison.evidence.formulaRevision.before)} · {t(locale, 'exploration.evidence.processRevision')} {revisionAfter(comparison.evidence.processRevision.after, comparison.evidence.processRevision.before)}</strong>
            </div>
          </div>

          {#each ['intrinsic', 'effective'] as family (family)}
            <div class="metric-group">
              <h5>{t(locale, `exploration.metric.${family}`)}</h5>
              <div class="metric-change-list">
                {#each comparison.metricChanges.filter((metric) => metric.family === family) as metric (metric.key)}
                  <div class="metric-change-row">
                    <div class="metric-name"><strong>{metricLabel(metric)}</strong><span>{metric.unit}</span></div>
                    <div class="metric-values"><span>{metricValue(metric.before, metric.unit)}</span><span aria-hidden="true">→</span><span>{metricValue(metric.after, metric.unit)}</span></div>
                    <div class="metric-statuses"><span class={`metric-status ${metric.status}`}>{metricStatusLabel(metric.status)}</span>{#if metric.availabilityChanged}<span class="availability-note">{t(locale, 'exploration.metric.availabilityChanged')}</span>{/if}</div>
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        {/if}

        {#if comparison.diagnostics.length > 0}
          <div class="comparison-diagnostics">
            {#each comparison.diagnostics as item (`${item.code}-${item.path}`)}
              <div class="exploration-error" role="status">
                <strong>{t(locale, item.messageKey, item.parameters)}</strong>
                <p>{t(locale, item.resolutionKey, item.parameters)}</p>
              </div>
            {/each}
          </div>
        {:else if comparison.counterfactual}
          <details class="evidence-details">
            <summary>{t(locale, 'exploration.evidence')}</summary>
            <div class="evidence-grid">
              <span>{t(locale, 'exploration.evidence.coverage')}: {Math.round(comparison.baseline.handoff.coverage.composition * 100)}% → {Math.round(comparison.counterfactual.handoff.coverage.composition * 100)}%</span>
              <span>{t(locale, 'exploration.evidence.confidence')}: {Math.round(comparison.baseline.handoff.confidence.composition * 100)}% → {Math.round(comparison.counterfactual.handoff.confidence.composition * 100)}%</span>
              <code>{comparison.evidence.modelVersions.before.handoffModelVersion}</code>
            </div>
          </details>
        {/if}
      </div>
    {/if}
  {/if}
</section>

<style>
  .exploration-panel {
    margin-top: 1.25rem;
    border: 1px solid rgba(184, 124, 79, 0.42);
    background: #fffaf3;
    padding: 1.25rem;
  }

  .exploration-heading,
  .comparison-heading,
  .list-heading,
  .exploration-start-row,
  .exploration-actions,
  .baseline-facts,
  .metric-change-row,
  .patch-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .exploration-kicker,
  .card-label,
  .column-label,
  .exploration-field > span,
  .metric-name span,
  .baseline-facts,
  .list-heading > span {
    color: #805541;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }

  .exploration-heading h3,
  .comparison-heading h4,
  .change-editor h4,
  .list-heading h4,
  .metric-group h5 {
    margin: 0.25rem 0 0;
    color: #23473c;
  }

  .exploration-heading h3 {
    font-size: 1.35rem;
  }

  .comparison-heading h4,
  .change-editor h4,
  .list-heading h4 {
    font-size: 1rem;
  }

  .metric-group h5 {
    border-bottom: 1px solid rgba(41, 75, 63, 0.16);
    font-size: 0.86rem;
    padding-bottom: 0.55rem;
  }

  .exploration-intro,
  .comparison-intro,
  .baseline-card p,
  .exploration-start-row p,
  .exploration-error p,
  .exploration-empty {
    color: #53625b;
    font-size: 0.83rem;
    line-height: 1.55;
  }

  .exploration-intro {
    max-width: 60rem;
    margin: 0.65rem 0 1rem;
  }

  .exploration-status,
  .outcome-chip,
  .owner-badge,
  .metric-status,
  .availability-note {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.27rem 0.48rem;
    font-size: 0.68rem;
    font-weight: 700;
  }

  .exploration-status.editing,
  .exploration-status.ready { background: #f7eadb; color: #805541; }
  .exploration-status.evaluated { background: #e4f0e5; color: #265b48; }
  .exploration-status.rejected { background: #f9dfd6; color: #8d3d2b; }
  .status-dot { width: 0.4rem; height: 0.4rem; border-radius: 50%; background: currentColor; }

  .exploration-start-row,
  .baseline-card,
  .change-editor,
  .patch-list,
  .comparison-card {
    border: 1px solid rgba(35, 71, 60, 0.16);
    padding: 1rem;
  }

  .exploration-start-row { background: #edf5ee; }
  .exploration-start-row p { margin: 0.3rem 0 0; }

  .exploration-button {
    border: 1px solid transparent;
    cursor: pointer;
    font: inherit;
    font-size: 0.76rem;
    font-weight: 700;
    padding: 0.72rem 0.9rem;
  }

  .exploration-button.primary { background: #2b5a4b; color: #fff; }
  .exploration-button.secondary { background: #f7eadb; border-color: #d9b08f; color: #70442f; }
  .exploration-button.quiet { background: transparent; color: #70442f; text-decoration: underline; text-underline-offset: 0.2rem; }
  .exploration-button:disabled { cursor: not-allowed; opacity: 0.48; }
  .exploration-button:focus-visible,
  select:focus-visible,
  input:focus-visible,
  summary:focus-visible { outline: 3px solid rgba(190, 102, 56, 0.45); outline-offset: 2px; }

  .baseline-card { margin-bottom: 1rem; background: #fff; }
  .baseline-card > div:first-child { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
  .baseline-card p { margin: 0.45rem 0 0.8rem; }
  .baseline-facts { justify-content: flex-start; flex-wrap: wrap; gap: 0.7rem 1.1rem; letter-spacing: 0.03em; text-transform: none; }
  .baseline-facts strong { color: #23473c; }

  .change-editor { background: #fff; }
  .change-grid { display: grid; grid-template-columns: minmax(15rem, 2fr) minmax(11rem, 1fr) minmax(10rem, 1fr); gap: 0.8rem; margin: 0.85rem 0; }
  .exploration-field { display: grid; gap: 0.35rem; }
  .exploration-field select,
  .exploration-field input { width: 100%; min-height: 2.65rem; border: 1px solid #c9c4bb; background: #fffdfa; color: #263f36; padding: 0.5rem 0.6rem; font: inherit; font-size: 0.85rem; }
  .exploration-field select:disabled { background: #f2eee8; color: #7b817b; }
  .change-editor > .exploration-button { margin-left: auto; display: block; }

  .exploration-error { margin-top: 0.8rem; border-left: 3px solid #b85d3d; background: #fff0e9; color: #713f2e; padding: 0.75rem 0.9rem; }
  .exploration-error strong { font-size: 0.8rem; }
  .exploration-error p { margin: 0.25rem 0 0; color: inherit; }
  .exploration-empty { margin: 0; border: 1px dashed rgba(35, 71, 60, 0.26); padding: 0.9rem; }

  .patch-list { margin-top: 1rem; background: #fff; }
  .list-heading { align-items: baseline; }
  .patch-row { border-top: 1px solid rgba(35, 71, 60, 0.13); padding: 0.7rem 0; align-items: flex-start; }
  .patch-row:first-of-type { margin-top: 0.55rem; }
  .patch-row > div:first-child { display: flex; align-items: center; gap: 0.55rem; min-width: 0; }
  .patch-row strong { color: #2c5145; font-size: 0.82rem; }
  .owner-badge.formula { background: #e5f0e6; color: #265b48; }
  .owner-badge.process { background: #f7eadb; color: #805541; }
  .patch-values { display: flex; align-items: center; gap: 0.45rem; color: #6a726e; font-size: 0.76rem; white-space: nowrap; }
  .patch-values strong { color: #23473c; }

  .exploration-actions { justify-content: flex-start; margin-top: 1rem; }
  .comparison-card { margin-top: 1rem; background: #fff; }
  .comparison-card.partial { border-color: #d9b08f; }
  .comparison-card.conflict,
  .comparison-card.rejected { border-color: #ce866c; background: #fffaf8; }
  .comparison-intro { margin: 0.55rem 0 0.9rem; }
  .outcome-chip { background: #edf5ee; color: #265b48; }
  .comparison-columns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.7rem; margin-bottom: 1rem; }
  .comparison-column { display: grid; gap: 0.35rem; border: 1px solid rgba(35, 71, 60, 0.14); padding: 0.75rem; }
  .comparison-column strong { color: #2c5145; font-size: 0.8rem; font-weight: 600; }
  .scenario-column { background: #edf5ee; }
  .metric-group + .metric-group { margin-top: 1rem; }
  .metric-change-list { display: grid; }
  .metric-change-row { border-bottom: 1px solid rgba(35, 71, 60, 0.1); padding: 0.65rem 0; align-items: center; }
  .metric-name { display: grid; gap: 0.18rem; min-width: 10rem; }
  .metric-name strong { color: #2c5145; font-size: 0.8rem; }
  .metric-name span { letter-spacing: 0.04em; text-transform: none; }
  .metric-values { display: flex; gap: 0.45rem; color: #616e67; font-size: 0.78rem; white-space: nowrap; }
  .metric-values span:last-child { color: #23473c; font-weight: 700; }
  .metric-statuses { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0.3rem; }
  .metric-status.changed { background: #e5f0e6; color: #265b48; }
  .metric-status.unchanged { background: #f2eee8; color: #5b655e; }
  .metric-status.unavailable { background: #f7eadb; color: #805541; }
  .availability-note { background: #fff0e9; color: #8d3d2b; font-size: 0.62rem; }
  .comparison-diagnostics { margin-top: 0.9rem; }
  .comparison-diagnostics .exploration-error:first-child { margin-top: 0; }
  .evidence-details { margin-top: 0.9rem; border-top: 1px solid rgba(35, 71, 60, 0.14); padding-top: 0.75rem; color: #53625b; font-size: 0.76rem; }
  .evidence-details summary { cursor: pointer; color: #70442f; font-weight: 700; }
  .evidence-grid { display: grid; gap: 0.35rem; margin-top: 0.65rem; }
  .evidence-grid code { color: #53625b; overflow-wrap: anywhere; }

  @media (max-width: 760px) {
    .exploration-panel { padding: 0.9rem; }
    .exploration-heading,
    .exploration-start-row,
    .comparison-heading,
    .exploration-actions,
    .patch-row { align-items: flex-start; flex-direction: column; }
    .exploration-start-row .exploration-button { width: 100%; }
    .change-grid,
    .comparison-columns { grid-template-columns: 1fr; }
    .change-editor > .exploration-button { margin-left: 0; width: 100%; }
    .patch-row > div:first-child { align-items: flex-start; flex-direction: column; gap: 0.35rem; }
    .metric-change-row { align-items: flex-start; display: grid; gap: 0.45rem; }
    .metric-statuses { justify-content: flex-start; }
    .metric-values { white-space: normal; }
    .baseline-facts { align-items: flex-start; flex-direction: column; }
  }
</style>
