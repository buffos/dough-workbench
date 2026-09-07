<script lang="ts">
  import { onMount } from 'svelte';
  import FieldHelp from './FieldHelp.svelte';
  import {
    COMPOSITION_FIELDS,
    INGREDIENT_ROLES,
    compositionFromCatalog,
    createInitialFormulaDraft,
    emptyComposition,
    knownDraftValue,
    noneDraftValue,
    unknownDraftValue,
  } from '../lib/domain/normalization';
  import { normalizeFormulaDraft, normalizeProcessDraft, prepareAnalysisInputDraft } from '../lib/application/formula-workspace';
  import {
    PROCESS_ADDITION_ACTIONS,
    PROCESS_FIELD_DESCRIPTORS,
    createInitialProcessDraft,
    type ProcessDraft,
    type ProcessFieldDescriptor,
    type ProcessNormalizationOutcome,
    type ProcessValuePath,
  } from '../lib/domain/process';
  import {
    STARTER_CATALOG,
    STARTER_CATALOG_VERSION,
    STARTER_FLOUR_CATALOG,
    STARTER_INGREDIENTS,
    catalogLabel,
  } from '../data/ingredients/starter-catalog';
  import type {
    CompositionField,
    DraftValueState,
    FormulaDraft,
    IngredientLineDraft,
    IngredientRole,
    NormalizationOutcome,
  } from '../lib/domain/types';
  import type { AnalysisInputOutcome, AnalysisPath, FormulaProcessReference } from '../lib/domain/handoff';
  import { localeHref, t, type Locale } from '../lib/i18n/messages';
  import {
    clearDraft,
    clearProcess,
    loadDraft,
    loadProcess,
    persistDraft,
    persistProcess,
  } from '../lib/state/workspace';
  import { createLocalCommandLedger } from '../lib/application/command-ledger';

  export let locale: Locale;
  export let basePath = '/';

  const processSections: Array<{ key: string; fields: ProcessFieldDescriptor[] }> = [
    { key: 'mixing', fields: PROCESS_FIELD_DESCRIPTORS.filter((field) => field.path.startsWith('mixing.')) as ProcessFieldDescriptor[] },
    { key: 'ingredientAddition', fields: PROCESS_FIELD_DESCRIPTORS.filter((field) => field.path.startsWith('ingredientAddition.')) as ProcessFieldDescriptor[] },
    { key: 'aeration', fields: PROCESS_FIELD_DESCRIPTORS.filter((field) => field.path.startsWith('aeration.')) as ProcessFieldDescriptor[] },
    { key: 'fermentation', fields: PROCESS_FIELD_DESCRIPTORS.filter((field) => field.path.startsWith('fermentation.')) as ProcessFieldDescriptor[] },
    { key: 'lamination', fields: PROCESS_FIELD_DESCRIPTORS.filter((field) => field.path.startsWith('lamination.')) as ProcessFieldDescriptor[] },
    { key: 'thermalProcess', fields: PROCESS_FIELD_DESCRIPTORS.filter((field) => field.path.startsWith('thermalProcess.')) as ProcessFieldDescriptor[] },
    { key: 'geometry', fields: PROCESS_FIELD_DESCRIPTORS.filter((field) => field.path.startsWith('geometry.')) as ProcessFieldDescriptor[] },
  ];
  const PROCESS_NONE_VALUE = '__process_none__';
  const commandLedger = createLocalCommandLedger();

  let draft: FormulaDraft = createInitialFormulaDraft();
  let processDraft: ProcessDraft = createInitialProcessDraft(draft.formulaId);
  let result: NormalizationOutcome | null = null;
  let processResult: ProcessNormalizationOutcome | null = null;
  let handoffResult: AnalysisInputOutcome | null = null;
  let lastValidHandoff: FormulaProcessReference | null = null;
  let requestedAnalysisPath: AnalysisPath = 'full';
  let hydrated = false;
  let explanationOpen = false;

  $: if (hydrated) {
    persistDraft(draft);
    persistProcess(processDraft);
  }

  onMount(() => {
    const savedDraft = loadDraft();
    if (savedDraft) {
      draft = savedDraft;
      result = normalizeFormulaDraft(savedDraft);
    }
    const savedProcess = loadProcess();
    if (savedProcess && savedProcess.formulaId === draft.formulaId) {
      processDraft = savedProcess;
      processResult = normalizeProcessDraft(savedProcess, draft.ingredientLines.map((line) => line.id));
    } else {
      processDraft = createInitialProcessDraft(draft.formulaId);
    }
    hydrated = true;
  });

  function touch(next: FormulaDraft): void {
    draft = { ...next, revision: next.revision + 1 };
    result = null;
    processResult = null;
    handoffResult = null;
    explanationOpen = false;
  }

  function touchProcess(next: ProcessDraft): void {
    processDraft = { ...next, revision: next.revision + 1 };
    processResult = null;
    handoffResult = null;
  }

  function createId(prefix: string): string {
    return `${prefix}-${Date.now()}-${draft.revision}`;
  }

  function updateFlour(id: string, patch: Partial<FormulaDraft['flourComponents'][number]>): void {
    touch({
      ...draft,
      flourComponents: draft.flourComponents.map((component) =>
        component.id === id ? { ...component, ...patch } : component,
      ),
    });
  }

  function updateLine(id: string, patch: Partial<IngredientLineDraft>): void {
    touch({
      ...draft,
      ingredientLines: draft.ingredientLines.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    });
  }

  function selectedFlourId(flour: FormulaDraft['flourComponents'][number]): string {
    if (flour.ingredientId) return flour.ingredientId;
    return STARTER_FLOUR_CATALOG.find((candidate) =>
      candidate.name === flour.name || candidate.label.en === flour.name || candidate.label.el === flour.name,
    )?.id ?? 'custom';
  }

  function selectedIngredientId(line: IngredientLineDraft): string {
    if (line.ingredientId) return line.ingredientId;
    return STARTER_INGREDIENTS.find((candidate) =>
      candidate.name === line.name || candidate.label.en === line.name || candidate.label.el === line.name,
    )?.id ?? 'custom';
  }

  function flourDisplayName(flour: FormulaDraft['flourComponents'][number]): string {
    const selected = STARTER_FLOUR_CATALOG.find((candidate) => candidate.id === selectedFlourId(flour));
    return selected ? catalogLabel(selected.label, locale) : flour.name;
  }

  function ingredientDisplayName(line: IngredientLineDraft): string {
    const selected = STARTER_CATALOG[selectedIngredientId(line)];
    return selected ? catalogLabel(selected.label, locale) : line.name;
  }

  function resultFlourDisplayName(id: string, fallback: string): string {
    const source = draft.flourComponents.find((candidate) => candidate.id === id);
    return source ? flourDisplayName(source) : fallback;
  }

  function resultIngredientDisplayName(id: string, fallback: string): string {
    const source = draft.ingredientLines.find((candidate) => candidate.id === id);
    return source ? ingredientDisplayName(source) : fallback;
  }

  function selectFlour(id: string, ingredientId: string): void {
    const flour = draft.flourComponents.find((candidate) => candidate.id === id);
    if (!flour) return;
    const selected = STARTER_FLOUR_CATALOG.find((candidate) => candidate.id === ingredientId);
    const wasCustom = selectedFlourId(flour) === 'custom';
    updateFlour(id, {
      ingredientId,
      name: selected
        ? selected.name
        : wasCustom
          ? flour.name
          : locale === 'el' ? 'Προσαρμοσμένο άλευρο' : 'Custom flour',
    });
  }

  function selectIngredient(id: string, ingredientId: string): void {
    const line = draft.ingredientLines.find((candidate) => candidate.id === id);
    if (!line) return;
    const selected = STARTER_CATALOG[ingredientId];
    const wasCustom = selectedIngredientId(line) === 'custom';
    updateLine(id, {
      ingredientId,
      name: selected
        ? selected.name
        : wasCustom
          ? line.name
          : locale === 'el' ? 'Προσαρμοσμένο υλικό' : 'Custom ingredient',
      composition: selected
        ? compositionFromCatalog(selected.composition, STARTER_CATALOG_VERSION, selected.id)
        : emptyComposition(),
      definitionSource: selected ? 'catalog' : 'custom',
      catalogReference: selected ? { ingredientId: selected.id, version: STARTER_CATALOG_VERSION } : undefined,
      definitionProvenance: selected
        ? { kind: 'catalog', sourceId: selected.id, sourceVersion: STARTER_CATALOG_VERSION }
        : { kind: 'custom', sourceId: 'local-custom-ingredient' },
      definitionConfidence: 1,
      compositionOverride: undefined,
      availabilityOverride: undefined,
    });
  }

  function updateCompositionState(lineId: string, field: CompositionField, nextState: string): void {
    const line = draft.ingredientLines.find((candidate) => candidate.id === lineId);
    if (!line) return;
    let nextValue: DraftValueState;
    if (nextState === 'known') {
      const current = line.composition[field];
      nextValue = current.state === 'known'
        ? current
        : knownDraftValue(0);
    } else if (nextState === 'none') {
      nextValue = noneDraftValue();
    } else {
      nextValue = unknownDraftValue();
    }
    updateLine(lineId, {
      composition: { ...line.composition, [field]: nextValue },
      compositionOverride: { ...line.compositionOverride, [field]: nextValue },
    });
  }

  function updateCompositionValue(lineId: string, field: CompositionField, value: string): void {
    const line = draft.ingredientLines.find((candidate) => candidate.id === lineId);
    if (!line || line.composition[field].state !== 'known') return;
    updateLine(lineId, {
      composition: {
        ...line.composition,
        [field]: { ...line.composition[field], value },
      },
      compositionOverride: {
        ...line.compositionOverride,
        [field]: { ...line.composition[field], value },
      },
    });
  }

  function updateDefinitionConfidence(lineId: string, value: string): void {
    const confidence = Number(value.replace(',', '.'));
    updateLine(lineId, { definitionConfidence: Number.isFinite(confidence) ? Math.min(1, Math.max(0, confidence)) : 0 });
  }

  function availabilityState(line: IngredientLineDraft): string {
    return line.availabilityOverride?.state ?? 'unset';
  }

  function updateAvailabilityState(lineId: string, nextState: string): void {
    const line = draft.ingredientLines.find((candidate) => candidate.id === lineId);
    if (!line) return;
    if (nextState === 'unset') {
      updateLine(lineId, { availabilityOverride: undefined });
      return;
    }
    if (nextState === 'none') {
      updateLine(lineId, { availabilityOverride: noneDraftValue() });
      return;
    }
    if (nextState === 'unknown') {
      updateLine(lineId, { availabilityOverride: unknownDraftValue('not-supplied') });
      return;
    }
    const current = line.availabilityOverride;
    updateLine(lineId, {
      availabilityOverride: current?.state === 'known' ? current : knownDraftValue('1'),
    });
  }

  function updateAvailabilityValue(lineId: string, value: string): void {
    const line = draft.ingredientLines.find((candidate) => candidate.id === lineId);
    if (!line || line.availabilityOverride?.state !== 'known') return;
    updateLine(lineId, { availabilityOverride: { ...line.availabilityOverride, value } });
  }

  function addFlour(commandId = createId('add-flour-command')): void {
    const currentRevision = draft.revision;
    commandLedger.execute({
      commandId,
      fingerprint: `add-flour:${currentRevision}`,
      currentRevision,
      expectedRevision: currentRevision,
    }, () => {
      touch({
        ...draft,
        flourComponents: [
          ...draft.flourComponents,
          {
            id: `${commandId}-flour`,
            ingredientId: 'custom',
            name: locale === 'el' ? 'Νέο άλευρο' : 'New flour',
            massGrams: '100',
            massUnit: 'g',
            flourBearing: true,
            declaredBlendPercentage: '',
          },
        ],
      });
      return { value: true, revision: draft.revision };
    });
  }

  function removeFlour(id: string): void {
    touch({ ...draft, flourComponents: draft.flourComponents.filter((component) => component.id !== id) });
  }

  function addIngredient(commandId = createId('add-ingredient-command')): void {
    const currentRevision = draft.revision;
    commandLedger.execute({
      commandId,
      fingerprint: `add-ingredient:${currentRevision}`,
      currentRevision,
      expectedRevision: currentRevision,
    }, () => {
      touch({
        ...draft,
        ingredientLines: [
          ...draft.ingredientLines,
          {
            id: `${commandId}-line`,
            ingredientId: 'custom',
            name: locale === 'el' ? 'Νέο υλικό' : 'New ingredient',
            massGrams: '10',
            massUnit: 'g',
            role: 'other',
            composition: emptyComposition(),
            definitionSource: 'custom',
            definitionProvenance: { kind: 'custom', sourceId: 'local-custom-ingredient' },
            definitionConfidence: 1,
          },
        ],
      });
      return { value: true, revision: draft.revision };
    });
  }

  function removeIngredient(id: string): void {
    touch({ ...draft, ingredientLines: draft.ingredientLines.filter((line) => line.id !== id) });
  }

  function runNormalization(): void {
    result = normalizeFormulaDraft(draft);
    explanationOpen = result.outcome !== 'rejected';
  }

  function processField(path: ProcessValuePath): DraftValueState {
    const [section, field] = path.split('.') as [keyof ProcessDraft, string];
    return (processDraft[section] as Record<string, DraftValueState>)[field];
  }

  function updateProcessState(path: ProcessValuePath, nextState: string): void {
    const current = processField(path);
    let nextValue: DraftValueState;
    if (nextState === 'known') {
      nextValue = current.state === 'known' ? current : knownDraftValue('');
    } else if (nextState === 'none') {
      nextValue = noneDraftValue();
    } else {
      nextValue = unknownDraftValue();
    }
    updateProcessField(path, nextValue);
  }

  function updateProcessKnownValue(path: ProcessValuePath, value: string): void {
    const current = processField(path);
    if (current.state !== 'known') return;
    updateProcessField(path, { ...current, value });
  }

  function processControlValue(current: DraftValueState): string {
    if (current.state === 'known') return current.value;
    return current.state === 'none' ? PROCESS_NONE_VALUE : '';
  }

  function processInputValue(current: DraftValueState): string {
    return current.state === 'known' ? current.value : '';
  }

  function updateProcessControl(path: ProcessValuePath, value: string): void {
    if (value === '') {
      updateProcessState(path, 'unknown');
      return;
    }
    if (value === PROCESS_NONE_VALUE) {
      updateProcessState(path, 'none');
      return;
    }
    const current = processField(path);
    if (current.state === 'known') {
      updateProcessKnownValue(path, value);
    } else {
      updateProcessField(path, knownDraftValue(value));
    }
  }

  function updateProcessInput(path: ProcessValuePath, value: string): void {
    if (!value.trim()) {
      updateProcessState(path, 'unknown');
      return;
    }
    const current = processField(path);
    if (current.state === 'known') {
      updateProcessKnownValue(path, value);
    } else {
      updateProcessField(path, knownDraftValue(value));
    }
  }

  function updateProcessNone(path: ProcessValuePath, checked: boolean): void {
    updateProcessState(path, checked ? 'none' : 'unknown');
  }

  function updateProcessField(path: ProcessValuePath, value: DraftValueState): void {
    const [section, field] = path.split('.') as [keyof ProcessDraft, string];
    const nextSection = { ...(processDraft[section] as Record<string, unknown>), [field]: value };
    touchProcess({ ...processDraft, [section]: nextSection } as ProcessDraft);
  }

  function addAdditionStep(commandId = createId('add-process-step-command')): void {
    const currentRevision = processDraft.revision;
    commandLedger.execute({
      commandId,
      fingerprint: `add-process-step:${currentRevision}`,
      currentRevision,
      expectedRevision: currentRevision,
    }, () => {
      const nextSequence = processDraft.ingredientAddition.steps.reduce((max, step) => Math.max(max, Number(step.sequence) || 0), 0) + 1;
      touchProcess({
        ...processDraft,
        ingredientAddition: {
          ...processDraft.ingredientAddition,
          steps: [
            ...processDraft.ingredientAddition.steps,
            { id: `${commandId}-step`, sequence: String(nextSequence), lineIds: [], action: '', durationSeconds: '' },
          ],
        },
      });
      return { value: true, revision: processDraft.revision };
    });
  }

  function updateAdditionStep(id: string, patch: Partial<ProcessDraft['ingredientAddition']['steps'][number]>): void {
    touchProcess({
      ...processDraft,
      ingredientAddition: {
        ...processDraft.ingredientAddition,
        steps: processDraft.ingredientAddition.steps.map((step) => step.id === id ? { ...step, ...patch } : step),
      },
    });
  }

  function toggleStepLine(stepId: string, lineId: string, checked: boolean): void {
    const step = processDraft.ingredientAddition.steps.find((candidate) => candidate.id === stepId);
    if (!step) return;
    const lineIds = checked ? [...new Set([...step.lineIds, lineId])] : step.lineIds.filter((id) => id !== lineId);
    updateAdditionStep(stepId, { lineIds });
  }

  function removeAdditionStep(id: string): void {
    touchProcess({
      ...processDraft,
      ingredientAddition: {
        ...processDraft.ingredientAddition,
        steps: processDraft.ingredientAddition.steps.filter((step) => step.id !== id),
      },
    });
  }

  function runProcessNormalization(): void {
    processResult = normalizeProcessDraft(processDraft, draft.ingredientLines.map((line) => line.id));
  }

  function runAnalysisHandoff(): void {
    const currentRevision = draft.revision;
    const commandId = `prepare-analysis:${draft.formulaId}:${draft.revision}:${processDraft.revision}`;
    const command = commandLedger.execute({
      commandId,
      fingerprint: `prepare-analysis:${draft.formulaId}:${draft.revision}:${processDraft.processId}:${processDraft.revision}`,
      currentRevision,
      expectedRevision: currentRevision,
    }, () => ({
      value: prepareAnalysisInputDraft(draft, processDraft, {
        commandId: `prepare-analysis:${draft.formulaId}:${draft.revision}:${processDraft.revision}`,
        expectedFormulaRevision: draft.revision,
        expectedProcessRevision: processDraft.revision,
        requestedPath: requestedAnalysisPath,
      }),
      revision: currentRevision,
    }));
    if (!command.value) return;
    handoffResult = command.value;
    if (handoffResult.data) lastValidHandoff = handoffResult.data;
  }

  function resetDraft(): void {
    clearDraft();
    clearProcess();
    commandLedger.clear();
    draft = createInitialFormulaDraft();
    processDraft = createInitialProcessDraft(draft.formulaId);
    result = null;
    processResult = null;
    handoffResult = null;
    lastValidHandoff = null;
    requestedAnalysisPath = 'full';
    explanationOpen = false;
    hydrated = true;
  }

  function formatNumber(value: number): string {
    return new Intl.NumberFormat(locale === 'el' ? 'el-GR' : 'en-US', {
      maximumFractionDigits: 2,
    }).format(value);
  }

  function formatPercent(value: number): string {
    return `${formatNumber(value * 100)}%`;
  }

  function stateLabel(state: DraftValueState | { state: string }): string {
    return t(locale, `state.${state.state}`);
  }

  function resultStatus(outcome: NormalizationOutcome['outcome']): string {
    return t(locale, `status.${outcome}`);
  }

  function readinessLabel(readiness: NormalizationOutcome['readiness']): string {
    return t(locale, `status.${readiness}`);
  }

  function provenanceLabel(kind: string): string {
    return t(locale, `provenance.${kind}`);
  }

  function diagnosticMessage(key: string, parameters: Record<string, string | number>): string {
    return t(locale, key, parameters);
  }

  function processStatusLabel(): string {
    return processResult ? t(locale, `process.status.${processResult.readiness}`) : t(locale, 'process.status.editing');
  }

  function handoffStatusLabel(outcome: AnalysisInputOutcome['outcome']): string {
    return t(locale, `analysis.handoff.outcome.${outcome}`);
  }

  function handoffReadinessLabel(readiness: FormulaProcessReference['readiness']): string {
    return t(locale, `analysis.handoff.readiness.${readiness}`);
  }

  function processFieldLabel(field: ProcessFieldDescriptor): string {
    return t(locale, `process.field.${field.key}`);
  }

  function processUnitLabel(field: ProcessFieldDescriptor): string {
    return field.unit ? t(locale, `process.unit.${field.unit}`) : '';
  }

  function processOptionLabel(option: string): string {
    return t(locale, `process.enum.${option}`);
  }

  function processReferenceLabel(line: IngredientLineDraft): string {
    const mass = line.massGrams.trim() ? ` · ${line.massGrams} g` : '';
    return `${ingredientDisplayName(line)}${mass}`;
  }

  function sourceLabel(line: IngredientLineDraft): string {
    return line.definitionSource === 'custom' || line.ingredientId === 'custom'
      ? t(locale, 'ingredient.custom')
      : t(locale, 'ingredient.catalog');
  }

  function overrideLabel(line: IngredientLineDraft): string {
    const fields = COMPOSITION_FIELDS.filter((field) => line.compositionOverride?.[field] !== undefined)
      .map((field) => t(locale, `field.${field}`));
    if (line.availabilityOverride) fields.push(t(locale, 'ingredient.availability'));
    return fields.length > 0 ? fields.join(', ') : t(locale, 'ingredient.noOverride');
  }
</script>

<svelte:head>
  <title>{locale === 'el' ? 'Dough Formula Intelligence — Φόρμουλα' : 'Dough Formula Intelligence — Formula'}</title>
  <meta
    name="description"
    content={locale === 'el'
      ? 'Δίγλωσσο εργαλείο για να εξερευνήσεις τη δομή και τις αναλογίες μιας ζύμης ή ενός batter.'
      : 'Explore the structure and ratios behind a dough or batter formula.'}
  />
</svelte:head>

<div class="app-shell">
  <header class="topbar">
    <a class="brand" href={localeHref(basePath, locale)} aria-label="Dough Formula Intelligence">
      <span class="brand-mark" aria-hidden="true">D/F</span>
      <span class="brand-copy">
        <span class="brand-eyebrow">{t(locale, 'brand.eyebrow')}</span>
        <span class="brand-name">Dough Formula<br />Intelligence</span>
      </span>
    </a>
    <nav class="topnav" aria-label={t(locale, 'nav.languageLabel')}>
      <span class="nav-current">{t(locale, 'nav.workspace')}</span>
      <a class="help-link" href={`${localeHref(basePath, locale)}help/`}>{t(locale, 'nav.help')}</a>
      <span class="nav-divider" aria-hidden="true"></span>
      <a class="language-link" href={localeHref(basePath, locale === 'en' ? 'el' : 'en')}>
        <span class="language-dot" aria-hidden="true"></span>
        {t(locale, 'nav.language')}
      </a>
    </nav>
  </header>

  <main>
    <section class="hero-section">
      <div class="hero-kicker"><span class="kicker-line"></span>{t(locale, 'workspace.kicker')}</div>
      <div class="hero-copy">
        <h1>{t(locale, 'brand.title')}</h1>
        <p>{t(locale, 'brand.subtitle')}</p>
      </div>
      <div class="hero-index" aria-hidden="true">
        <span>01</span>
        <span class="hero-index-rule"></span>
        <span>DFI</span>
      </div>
    </section>

    <section class="workspace-heading">
      <div>
        <p class="section-kicker">{t(locale, 'nav.workspace')}</p>
        <h2>{t(locale, 'workspace.title')}</h2>
        <p class="workspace-description">{t(locale, 'workspace.description')}</p>
      </div>
      <div class="draft-meta">
        <button type="button" class="text-button" on:click={resetDraft}>{t(locale, 'action.startOver')}</button>
      </div>
    </section>

    <div class="workspace-grid">
      <section class="editor-panel panel">
        <div class="panel-heading">
          <div>
            <span class="panel-number">01</span>
            <h3>{t(locale, 'workspace.title')}</h3>
          </div>
          <span class="draft-status"><span class="status-dot"></span>{t(locale, 'status.editing')}</span>
        </div>

        <div class="editor-section">
          <div class="subheading-row">
            <div>
              <span class="section-index">A</span>
              <h4>{t(locale, 'section.flours')}</h4>
            </div>
            <button type="button" class="small-button" on:click={addFlour}>+ {t(locale, 'action.addFlour')}</button>
          </div>
          <p class="section-help">{t(locale, 'section.flourHelp')}</p>

          <div class="line-list">
            {#each draft.flourComponents as flour, index (flour.id)}
              <div class="input-row flour-row">
                <span class="row-index">{String(index + 1).padStart(2, '0')}</span>
                <label class="field field-name">
                  <FieldHelp
                    label={t(locale, 'field.flour')}
                    help={t(locale, 'help.field.flour')}
                    helpId={`help-flour-name-${flour.id}`}
                  />
                  <select
                    aria-label={`${t(locale, 'field.flour')} ${index + 1}`}
                    value={selectedFlourId(flour)}
                    on:change={(event) => selectFlour(flour.id, (event.currentTarget as HTMLSelectElement).value)}
                  >
                    <option value="custom">{t(locale, 'catalog.customFlour')}</option>
                    {#each STARTER_FLOUR_CATALOG as option (option.id)}
                      <option value={option.id}>{catalogLabel(option.label, locale)}</option>
                    {/each}
                  </select>
                  {#if selectedFlourId(flour) === 'custom'}
                    <input
                      class="custom-name-input"
                      aria-label={`${t(locale, 'catalog.customFlour')} ${index + 1}`}
                      value={flour.name}
                      on:input={(event) => updateFlour(flour.id, { name: (event.currentTarget as HTMLInputElement).value })}
                    />
                  {/if}
                </label>
                <label class="field field-mass">
                  <FieldHelp
                    label={`${t(locale, 'field.mass')} (${t(locale, 'unit.grams')})`}
                    help={t(locale, 'help.field.mass')}
                    helpId={`help-flour-mass-${flour.id}`}
                  />
                  <input
                    class="mass-input"
                    aria-label={`${t(locale, 'field.mass')} ${flourDisplayName(flour)}`}
                    inputmode="decimal"
                    value={flour.massGrams}
                    on:input={(event) => updateFlour(flour.id, { massGrams: (event.currentTarget as HTMLInputElement).value })}
                  />
                </label>
                <label class="field field-blend">
                  <FieldHelp
                    label={t(locale, 'field.blend')}
                    help={t(locale, 'help.field.blend')}
                    helpId={`help-flour-blend-${flour.id}`}
                  />
                  <input
                    aria-label={`${t(locale, 'field.blend')} ${flourDisplayName(flour)}`}
                    inputmode="decimal"
                    placeholder="—"
                    value={flour.declaredBlendPercentage}
                    on:input={(event) => updateFlour(flour.id, { declaredBlendPercentage: (event.currentTarget as HTMLInputElement).value })}
                  />
                </label>
                <button
                  type="button"
                  class="remove-button"
                  aria-label={`${t(locale, 'action.remove')} ${flourDisplayName(flour)}`}
                  on:click={() => removeFlour(flour.id)}
                >×</button>
              </div>
            {/each}
          </div>
          <p class="micro-note"><span class="micro-icon">i</span>{t(locale, 'result.policyBody')}</p>
        </div>

        <div class="editor-section ingredient-section">
          <div class="subheading-row">
            <div>
              <span class="section-index">B</span>
              <h4>{t(locale, 'section.ingredients')}</h4>
            </div>
            <button type="button" class="small-button" on:click={addIngredient}>+ {t(locale, 'action.addIngredient')}</button>
          </div>
          <p class="section-help">{t(locale, 'section.ingredientHelp')}</p>

          <details class="role-guide">
            <summary>{t(locale, 'role.guideTitle')}</summary>
            <p>{t(locale, 'role.guideIntro')}</p>
            <ul>
              {#each INGREDIENT_ROLES as role (role)}
                <li><strong>{t(locale, `role.${role}`)}</strong><span>{t(locale, `role.description.${role}`)}</span></li>
              {/each}
            </ul>
          </details>

          <div class="ingredient-list">
            {#each draft.ingredientLines as line, index (line.id)}
              <article class="ingredient-card">
                <div class="ingredient-card-head">
                  <span class="row-index">{String(index + 1).padStart(2, '0')}</span>
                  <label class="field field-name">
                    <FieldHelp
                      label={t(locale, 'field.ingredient')}
                      help={t(locale, 'help.field.ingredient')}
                      helpId={`help-ingredient-name-${line.id}`}
                    />
                    <select
                      aria-label={`${t(locale, 'field.ingredient')} ${index + 1}`}
                      value={selectedIngredientId(line)}
                      on:change={(event) => selectIngredient(line.id, (event.currentTarget as HTMLSelectElement).value)}
                    >
                      <option value="custom">{t(locale, 'catalog.customIngredient')}</option>
                      {#each STARTER_INGREDIENTS as option (option.id)}
                        <option value={option.id}>{catalogLabel(option.label, locale)}</option>
                      {/each}
                    </select>
                    {#if selectedIngredientId(line) === 'custom'}
                      <input
                        class="custom-name-input"
                        aria-label={`${t(locale, 'catalog.customIngredient')} ${index + 1}`}
                        value={line.name}
                        on:input={(event) => updateLine(line.id, { name: (event.currentTarget as HTMLInputElement).value })}
                      />
                    {/if}
                  </label>
                  <label class="field field-mass">
                    <FieldHelp
                      label={`${t(locale, 'field.mass')} (${t(locale, 'unit.grams')})`}
                      help={t(locale, 'help.field.mass')}
                      helpId={`help-ingredient-mass-${line.id}`}
                    />
                    <input
                      class="mass-input"
                      aria-label={`${t(locale, 'field.mass')} ${ingredientDisplayName(line)}`}
                      inputmode="decimal"
                      value={line.massGrams}
                      on:input={(event) => updateLine(line.id, { massGrams: (event.currentTarget as HTMLInputElement).value })}
                    />
                  </label>
                  <label class="field field-role">
                    <FieldHelp
                      label={t(locale, 'field.role')}
                      help={t(locale, 'help.field.role')}
                      helpId={`help-ingredient-role-${line.id}`}
                    />
                    <select
                      aria-label={`${t(locale, 'field.role')} ${ingredientDisplayName(line)}`}
                      value={line.role}
                      on:change={(event) => updateLine(line.id, { role: (event.currentTarget as HTMLSelectElement).value as IngredientRole })}
                    >
                      {#each INGREDIENT_ROLES as role (role)}
                        <option value={role}>{t(locale, `role.${role}`)}</option>
                      {/each}
                    </select>
                  </label>
                  <button
                    type="button"
                    class="remove-button"
                    aria-label={`${t(locale, 'action.remove')} ${ingredientDisplayName(line)}`}
                    on:click={() => removeIngredient(line.id)}
                  >×</button>
                </div>

                <div class="composition-block">
                  <div class="composition-heading">
                    <span>{t(locale, 'section.composition')}</span>
                    <span class="composition-note">{t(locale, 'state.zeroHint')}</span>
                  </div>
                  <div class="composition-grid">
                    {#each COMPOSITION_FIELDS as field (field)}
                      <div class="composition-field">
                        <FieldHelp
                          label={`${t(locale, `field.${field}`)}${line.compositionOverride?.[field] !== undefined ? ' *' : ''}`}
                          help={t(locale, `help.field.${field}`)}
                          helpId={`help-composition-${line.id}-${field}`}
                        />
                        <select
                          aria-label={`${t(locale, `field.${field}`)} ${t(locale, 'field.state')}`}
                          value={line.composition[field].state}
                          on:change={(event) => updateCompositionState(line.id, field, (event.currentTarget as HTMLSelectElement).value)}
                        >
                          <option value="unknown">{t(locale, 'state.unknown')}</option>
                          <option value="none">{t(locale, 'state.none')}</option>
                          <option value="known">{t(locale, 'state.known')}</option>
                        </select>
                        {#if line.composition[field].state === 'known'}
                          <label class="composition-value">
                            <span class="sr-only">{t(locale, 'field.value')}</span>
                            <input
                              aria-label={`${t(locale, `field.${field}`)} ${t(locale, 'field.value')}`}
                              inputmode="decimal"
                              value={line.composition[field].state === 'known' ? line.composition[field].value : ''}
                              on:input={(event) => updateCompositionValue(line.id, field, (event.currentTarget as HTMLInputElement).value)}
                            />
                            <span>%</span>
                          </label>
                        {/if}
                      </div>
                    {/each}
                  </div>
                </div>

                <div class="ingredient-meta">
                  <div class="ingredient-source-line">
                    <FieldHelp
                      label={t(locale, 'ingredient.source')}
                      help={t(locale, 'help.ingredient.source')}
                      helpId={`help-ingredient-source-${line.id}`}
                    />
                    <strong>{sourceLabel(line)}</strong>
                    {#if line.catalogReference}
                      <small>{t(locale, 'ingredient.catalogVersion')}: {line.catalogReference.version}</small>
                    {/if}
                  </div>
                  <label class="meta-field">
                    <FieldHelp
                      label={t(locale, 'ingredient.confidence')}
                      help={t(locale, 'help.ingredient.confidence')}
                      helpId={`help-ingredient-confidence-${line.id}`}
                    />
                    <input
                      aria-label={`${t(locale, 'ingredient.confidence')} ${ingredientDisplayName(line)}`}
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={line.definitionConfidence ?? 1}
                      on:input={(event) => updateDefinitionConfidence(line.id, (event.currentTarget as HTMLInputElement).value)}
                    />
                  </label>
                  <div class="override-summary">
                    <FieldHelp
                      label={t(locale, 'ingredient.localOverride')}
                      help={t(locale, 'help.ingredient.localOverride')}
                      helpId={`help-ingredient-override-${line.id}`}
                    />
                    <strong>{overrideLabel(line)}</strong>
                  </div>
                  <div class="availability-row">
                    <label class="meta-field">
                      <FieldHelp
                        label={t(locale, 'ingredient.availability')}
                        help={t(locale, 'help.ingredient.availability')}
                        helpId={`help-ingredient-availability-${line.id}`}
                      />
                      <select
                        aria-label={`${t(locale, 'ingredient.availability')} ${ingredientDisplayName(line)}`}
                        value={availabilityState(line)}
                        on:change={(event) => updateAvailabilityState(line.id, (event.currentTarget as HTMLSelectElement).value)}
                      >
                        <option value="unset">{t(locale, 'ingredient.noAvailabilityOverride')}</option>
                        <option value="none">{t(locale, 'state.none')}</option>
                        <option value="unknown">{t(locale, 'state.unknown')}</option>
                        <option value="known">{t(locale, 'state.known')}</option>
                      </select>
                    </label>
                    {#if line.availabilityOverride?.state === 'known'}
                      <label class="meta-field availability-value">
                        <FieldHelp
                          label={`${t(locale, 'ingredient.availabilityOverrideShort')} (0–1)`}
                          help={t(locale, 'help.ingredient.availabilityOverride')}
                          helpId={`help-ingredient-availability-value-${line.id}`}
                        />
                        <input
                          aria-label={`${t(locale, 'ingredient.availabilityOverride')} ${ingredientDisplayName(line)}`}
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          value={line.availabilityOverride.value}
                          on:input={(event) => updateAvailabilityValue(line.id, (event.currentTarget as HTMLInputElement).value)}
                        />
                      </label>
                    {/if}
                  </div>
                </div>
              </article>
            {/each}
          </div>
        </div>

        <div class="editor-footer">
          <div class="unit-lock"><span class="lock-mark">↳</span><span>{t(locale, 'formula.validation.useGrams')}</span></div>
          <button type="button" class="primary-button" on:click={runNormalization}>
            <span>{t(locale, 'action.normalize')}</span><span class="button-arrow">→</span>
          </button>
        </div>
      </section>

      <section class="process-panel panel">
        <div class="panel-heading">
          <div>
            <span class="panel-number">03</span>
            <h3>{t(locale, 'section.process')}</h3>
          </div>
          <span class="draft-status"><span class="status-dot"></span>{processStatusLabel()}</span>
        </div>

        <div class="process-intro">
          <div>
            <p>{t(locale, 'section.processHelp')}</p>
            <p class="process-state-help">{t(locale, 'process.valueHelp')}</p>
          </div>
          <span>{t(locale, 'process.revision')}: {processDraft.revision}</span>
        </div>

        <div class="process-grid">
          {#each processSections as section (section.key)}
            <fieldset class="process-section">
              <legend>{t(locale, `process.section.${section.key}`)}</legend>
              <div class="process-fields">
                {#each section.fields as field (field.path)}
                  {@const current = processField(field.path)}
                  <div class="process-field">
                    <FieldHelp
                      label={`${processFieldLabel(field)}${processUnitLabel(field) ? ` (${processUnitLabel(field)})` : ''}`}
                      help={t(locale, `help.process.${field.path}`)}
                      helpId={`help-process-${field.path.replace('.', '-')}`}
                    />
                    {#if field.kind === 'enum' || field.kind === 'boolean'}
                      <select
                        aria-label={processFieldLabel(field)}
                        value={processControlValue(current)}
                        on:change={(event) => updateProcessControl(field.path, (event.currentTarget as HTMLSelectElement).value)}
                      >
                        <option value="">{t(locale, 'process.notRecorded')}</option>
                        <option value={PROCESS_NONE_VALUE}>{t(locale, 'state.none')}</option>
                        {#each field.options ?? [] as option (option)}
                          <option value={option}>{processOptionLabel(option)}</option>
                        {/each}
                      </select>
                    {:else if field.kind === 'reference'}
                      <select
                        aria-label={processFieldLabel(field)}
                        value={processControlValue(current)}
                        on:change={(event) => updateProcessControl(field.path, (event.currentTarget as HTMLSelectElement).value)}
                      >
                        <option value="">{t(locale, 'process.notRecorded')}</option>
                        <option value={PROCESS_NONE_VALUE}>{t(locale, 'state.none')}</option>
                        {#if current.state === 'known' && !draft.ingredientLines.some((line) => line.id === current.value)}
                          <option value={current.value}>{t(locale, 'process.reference.unresolved')}</option>
                        {/if}
                        {#each draft.ingredientLines as line (line.id)}
                          <option value={line.id}>{processReferenceLabel(line)}</option>
                        {/each}
                      </select>
                    {:else}
                      <input
                        aria-label={processFieldLabel(field)}
                        type="number"
                        inputmode="decimal"
                        min={field.min}
                        max={field.max}
                        step={field.integer ? '1' : '0.01'}
                        placeholder={t(locale, 'process.notRecorded')}
                        value={processInputValue(current)}
                        disabled={current.state === 'none'}
                        on:input={(event) => updateProcessInput(field.path, (event.currentTarget as HTMLInputElement).value)}
                      />
                      <label class="process-none-toggle">
                        <input
                          type="checkbox"
                          aria-label={`${processFieldLabel(field)} ${t(locale, 'state.none')}`}
                          checked={current.state === 'none'}
                          on:change={(event) => updateProcessNone(field.path, (event.currentTarget as HTMLInputElement).checked)}
                        />
                        <span>{t(locale, 'state.none')}</span>
                      </label>
                    {/if}
                  </div>
                {/each}
              </div>

              {#if section.key === 'ingredientAddition'}
                <div class="addition-heading">
                  <span>{t(locale, 'section.processTimeline')}</span>
                  <button type="button" class="small-button" on:click={addAdditionStep}>+ {t(locale, 'action.addStep')}</button>
                </div>
                <p class="addition-help">{t(locale, 'process.addition.help')}</p>
                {#if processDraft.ingredientAddition.steps.length === 0}
                  <p class="process-empty">{t(locale, 'process.addition.empty')}</p>
                {:else}
                  <div class="addition-list">
                    {#each processDraft.ingredientAddition.steps as step (step.id)}
                      <article class="addition-step">
                        <div class="addition-step-head">
                          <label class="meta-field sequence-field">
                            <FieldHelp
                              label={t(locale, 'process.addition.step')}
                              help={t(locale, 'help.process.addition.step')}
                              helpId={`help-addition-step-${step.id}`}
                            />
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={step.sequence}
                              on:input={(event) => updateAdditionStep(step.id, { sequence: (event.currentTarget as HTMLInputElement).value })}
                            />
                          </label>
                          <label class="meta-field addition-action">
                            <FieldHelp
                              label={t(locale, 'process.addition.action')}
                              help={t(locale, 'help.process.addition.action')}
                              helpId={`help-addition-action-${step.id}`}
                            />
                            <select
                              aria-label={t(locale, 'process.addition.action')}
                              value={step.action}
                              on:change={(event) => updateAdditionStep(step.id, { action: (event.currentTarget as HTMLSelectElement).value })}
                            >
                              <option value="">{t(locale, 'process.notRecorded')}</option>
                              {#each PROCESS_ADDITION_ACTIONS as action (action)}
                                <option value={action}>{processOptionLabel(action)}</option>
                              {/each}
                            </select>
                          </label>
                          <label class="meta-field duration-field">
                            <FieldHelp
                              label={`${t(locale, 'process.addition.duration')} (${t(locale, 'process.unit.seconds')})`}
                              help={t(locale, 'help.process.addition.duration')}
                              helpId={`help-addition-duration-${step.id}`}
                            />
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={step.durationSeconds}
                              on:input={(event) => updateAdditionStep(step.id, { durationSeconds: (event.currentTarget as HTMLInputElement).value })}
                            />
                          </label>
                          <button type="button" class="remove-button" aria-label={`${t(locale, 'action.remove')} ${t(locale, 'process.addition.step')} ${step.sequence}`} on:click={() => removeAdditionStep(step.id)}>×</button>
                        </div>
                        <div class="addition-lines">
                          <FieldHelp
                            label={t(locale, 'process.addition.lines')}
                            help={t(locale, 'help.process.addition.lines')}
                            helpId={`help-addition-lines-${step.id}`}
                            wide
                          />
                          {#each draft.ingredientLines as line (line.id)}
                            <label>
                              <input
                                type="checkbox"
                                checked={step.lineIds.includes(line.id)}
                                on:change={(event) => toggleStepLine(step.id, line.id, (event.currentTarget as HTMLInputElement).checked)}
                              />
                              <span>{ingredientDisplayName(line)}</span>
                            </label>
                          {/each}
                        </div>
                      </article>
                    {/each}
                  </div>
                {/if}
              {/if}
            </fieldset>
          {/each}
        </div>

        <div class="process-footer">
          <div class="process-state-note">
            <span>{t(locale, 'process.unknownMeaning')}</span>
            <span>{t(locale, 'process.noneMeaning')}</span>
          </div>
          <button type="button" class="primary-button" on:click={runProcessNormalization}>
            <span>{t(locale, 'action.recordProcess')}</span><span class="button-arrow">→</span>
          </button>
        </div>

        {#if processResult}
          <div class={`process-result ${processResult.outcome}`}>
            <div>
              <strong>{t(locale, 'process.recorded')} · {processStatusLabel()}</strong>
              <span>{t(locale, 'metric.coverage')}: {formatPercent(processResult.coverage)} · {t(locale, 'metric.confidence')}: {formatPercent(processResult.confidence)}</span>
            </div>
          </div>
          {#if processResult.outcome === 'partial'}
            <div class="partial-note process-partial-note"><span>◐</span><p>{t(locale, 'process.partialBody')}</p></div>
          {/if}
          {#if processResult.diagnostics.length > 0}
            <div class="diagnostic-list process-diagnostics" aria-live="polite">
              {#each processResult.diagnostics as diagnostic (`${diagnostic.code}-${diagnostic.path}`)}
                <div class="diagnostic">
                  <div class="diagnostic-topline"><strong>{diagnosticMessage(diagnostic.messageKey, diagnostic.parameters)}</strong><code>{diagnostic.code}</code></div>
                  <p>{diagnosticMessage(diagnostic.resolutionKey, diagnostic.parameters)}</p>
                  <span class="diagnostic-path">{diagnostic.path}</span>
                </div>
              {/each}
            </div>
          {/if}
        {/if}
      </section>

      <section class="result-panel panel">
        <div class="panel-heading result-heading">
          <div>
            <span class="panel-number">02</span>
            <h3>{t(locale, 'section.results')}</h3>
          </div>
          {#if result}
            <span class={`result-status ${result.outcome}`}><span class="status-dot"></span>{resultStatus(result.outcome)}</span>
          {:else}
            <span class="result-status idle"><span class="status-dot"></span>{t(locale, 'status.editing')}</span>
          {/if}
        </div>

        <div class={`analysis-handoff ${handoffResult ? handoffResult.outcome : 'idle'}`}>
          <div class="handoff-heading">
            <div>
              <span class="handoff-kicker">{t(locale, 'analysis.handoff.kicker')}</span>
              <h4>{t(locale, 'analysis.handoff.title')}</h4>
            </div>
            {#if handoffResult}
              <span class="handoff-status"><span class="status-dot"></span>{handoffStatusLabel(handoffResult.outcome)}</span>
            {/if}
          </div>
          <p class="handoff-help">{t(locale, 'analysis.handoff.help')}</p>
          <label class="handoff-path-field">
            <span>{t(locale, 'analysis.handoff.path')}</span>
            <select
              aria-label={t(locale, 'analysis.handoff.path')}
              value={requestedAnalysisPath}
              on:change={(event) => {
                requestedAnalysisPath = (event.currentTarget as HTMLSelectElement).value as AnalysisPath;
                handoffResult = null;
              }}
            >
              <option value="full">{t(locale, 'analysis.handoff.path.full')}</option>
              <option value="composition">{t(locale, 'analysis.handoff.path.composition')}</option>
            </select>
          </label>
          <button type="button" class="handoff-button" on:click={runAnalysisHandoff}>
            <span>{t(locale, 'action.prepareAnalysis')}</span><span class="button-arrow">→</span>
          </button>

          {#if !handoffResult}
            <p class="handoff-idle-note">{t(locale, 'analysis.handoff.idle')}</p>
          {:else}
            <div class="handoff-outcome">
              <div class="handoff-outcome-heading">
                <div>
                  <strong>{handoffStatusLabel(handoffResult.outcome)}</strong>
                  {#if handoffResult.data}
                    <span>{handoffReadinessLabel(handoffResult.data.readiness)}</span>
                  {/if}
                </div>
                <span class="handoff-revisions">{t(locale, 'analysis.handoff.revisions', { formula: handoffResult.formulaRevision, process: handoffResult.processRevision })}</span>
              </div>

              {#if handoffResult.data}
                <div class="handoff-metrics">
                  <div><span>{t(locale, 'analysis.handoff.composition')}</span><strong>{formatPercent(handoffResult.coverage.composition)}</strong><small>{formatPercent(handoffResult.confidence.composition)} {t(locale, 'metric.confidence').toLowerCase()}</small></div>
                  <div><span>{t(locale, 'analysis.handoff.process')}</span><strong>{formatPercent(handoffResult.coverage.process)}</strong><small>{formatPercent(handoffResult.confidence.process)} {t(locale, 'metric.confidence').toLowerCase()}</small></div>
                </div>
                <div class="handoff-meta"><span>{t(locale, 'analysis.handoff.referenceVersion')}: <code>{handoffResult.data.referenceVersion}</code></span><span>{t(locale, 'analysis.handoff.modelVersion')}: <code>{handoffResult.data.modelVersion}</code></span></div>
              {/if}

              {#if handoffResult.diagnostics.length > 0}
                <div class="diagnostic-list handoff-diagnostics" aria-live="polite">
                  {#each handoffResult.diagnostics as handoffDiagnostic (`${handoffDiagnostic.code}-${handoffDiagnostic.path}`)}
                    <div class="diagnostic">
                      <div class="diagnostic-topline"><strong>{t(locale, handoffDiagnostic.messageKey, handoffDiagnostic.parameters)}</strong><code>{handoffDiagnostic.code}</code></div>
                      <p>{t(locale, handoffDiagnostic.resolutionKey, handoffDiagnostic.parameters)}</p>
                      <span class="diagnostic-path">{handoffDiagnostic.path}</span>
                    </div>
                  {/each}
                </div>
              {/if}

              {#if handoffResult.limitations.length > 0}
                <div class="handoff-limitations">
                  <h5>{t(locale, 'analysis.handoff.limitations')}</h5>
                  <ul>
                    {#each handoffResult.limitations as item (`${item.code}-${item.path}`)}
                      <li>{t(locale, item.messageKey, item.parameters)} <code>{item.path}</code></li>
                    {/each}
                  </ul>
                </div>
              {:else if handoffResult.data}
                <p class="handoff-no-limitations">{t(locale, 'analysis.handoff.noLimitations')}</p>
              {/if}

              {#if handoffResult.outcome === 'conflict' || handoffResult.outcome === 'rejected'}
                <p class="handoff-recovery">{lastValidHandoff ? t(locale, 'analysis.handoff.recovery') : t(locale, 'analysis.handoff.noRecovery')}</p>
              {/if}
            </div>
          {/if}
        </div>

        {#if !result}
          <div class="empty-result">
            <div class="empty-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
            <h4>{t(locale, 'result.emptyTitle')}</h4>
            <p>{t(locale, 'result.emptyBody')}</p>
          </div>
        {:else}
          <div class={`outcome-banner ${result.outcome}`}>
            <div class="outcome-icon">{result.outcome === 'rejected' ? '!' : result.outcome === 'partial' ? '◐' : '✓'}</div>
            <div>
              <strong>{resultStatus(result.outcome)}</strong>
              <span>{readinessLabel(result.readiness)}</span>
            </div>
          </div>

          {#if result.diagnostics.length > 0}
            <div class="diagnostic-list" aria-live="polite">
              {#each result.diagnostics as diagnostic (`${diagnostic.code}-${diagnostic.path}`)}
                <div class={`diagnostic ${diagnostic.severity}`}>
                  <div class="diagnostic-topline">
                    <strong>{diagnosticMessage(diagnostic.messageKey, diagnostic.parameters)}</strong>
                    <code>{diagnostic.code}</code>
                  </div>
                  <p>{diagnosticMessage(diagnostic.resolutionKey, diagnostic.parameters)}</p>
                  <span class="diagnostic-path">{diagnostic.path}</span>
                </div>
              {/each}
            </div>
          {/if}

          {#if result.data}
            {#if result.outcome === 'partial'}
              <div class="partial-note"><span>◐</span><p>{t(locale, 'result.partialBody')}</p></div>
            {/if}

            <div class="metric-grid">
              <div class="metric-card metric-featured">
                <span class="metric-label">{t(locale, 'metric.denominator')}</span>
                <strong>{formatNumber(result.data.structuralFlourDenominator.value)}<small> g</small></strong>
                <span class="metric-foot"><span class="semantic-tag calculated">{t(locale, 'semantic.calculated')}</span></span>
              </div>
              <div class="metric-card">
                <span class="metric-label">{t(locale, 'metric.coverage')}</span>
                <strong>{formatPercent(result.coverage)}</strong>
                <span class="metric-foot">{t(locale, 'metric.available')}</span>
              </div>
              <div class="metric-card">
                <span class="metric-label">{t(locale, 'metric.confidence')}</span>
                <strong>{formatPercent(result.confidence)}</strong>
                <span class="metric-foot">{t(locale, 'result.provenance')}</span>
              </div>
            </div>

            <div class="result-block">
              <div class="result-block-heading"><h4>{t(locale, 'section.flours')}</h4><span>{t(locale, 'metric.blend')}</span></div>
              <div class="data-table">
                <div class="table-row table-head"><span>{t(locale, 'field.name')}</span><span>{t(locale, 'field.mass')}</span><span>{t(locale, 'metric.blend')}</span><span>{t(locale, 'metric.semantic')}</span></div>
                {#each result.data.flourComponents as flour (flour.id)}
                  <div class="table-row"><span class="table-name">{resultFlourDisplayName(flour.id, flour.name)}</span><span>{formatNumber(flour.mass.value)} g</span><span>{formatNumber(flour.blendFraction.value)}%</span><span><span class="semantic-tag calculated">{t(locale, 'semantic.calculated')}</span></span></div>
                {/each}
              </div>
            </div>

            <div class="result-block">
              <div class="result-block-heading"><h4>{t(locale, 'section.ingredients')}</h4><span>{t(locale, 'metric.bakers')}</span></div>
              <div class="data-table">
                <div class="table-row table-head"><span>{t(locale, 'field.name')}</span><span>{t(locale, 'field.role')}</span><span>{t(locale, 'field.mass')}</span><span>{t(locale, 'metric.bakers')}</span></div>
                {#each result.data.ingredientLines as line (line.id)}
                  <div class="table-row ingredient-result-row">
                     <span class="table-name">{resultIngredientDisplayName(line.id, line.name)}<small><span class="state-mini">{line.definitionSource === 'catalog' ? t(locale, 'ingredient.catalog') : t(locale, 'ingredient.custom')} · {formatPercent(line.compositionConfidence)}</span><span class="state-mini">{t(locale, `participation.${line.participation.metricFamily}`)}</span>{#if line.overrides.fields.length > 0 || line.overrides.availability}<span class="state-mini unknown">{t(locale, 'ingredient.localOverride')}</span>{/if}{#each COMPOSITION_FIELDS as field (field)}<span class={`state-mini ${line.composition[field].state}`}>{t(locale, `field.${field}`)} · {stateLabel(line.composition[field])}</span>{/each}</small></span>
                    <span>{t(locale, `role.${line.role}`)}</span><span>{formatNumber(line.mass.value)} g</span><span>{formatNumber(line.bakersPercentage.value)}%</span>
                  </div>
                {/each}
              </div>
            </div>

            <div class="result-block metrics-block">
              <div class="result-block-heading"><h4>{t(locale, 'section.composition')}</h4><span>{t(locale, 'metric.semantic')}</span></div>
              <div class="composition-metrics">
                {#each COMPOSITION_FIELDS as field (field)}
                  {@const metric = result.data.compositionMetrics[field]}
                  <div class="composition-metric-card" class:unavailable={!metric.available}>
                    <span>{t(locale, `field.${field}`)}</span>
                    {#if metric.available}<strong>{formatNumber(metric.value ?? 0)} g</strong>{:else}<strong>—</strong>{/if}
                    <small>{metric.available ? t(locale, 'semantic.calculated') : t(locale, 'result.metricUnavailable')}</small>
                  </div>
                {/each}
              </div>
            </div>

            <div class="policy-strip"><span>{t(locale, 'result.policy')}</span><strong>{t(locale, 'result.policyBody')}</strong></div>

            <button type="button" class="explanation-toggle" on:click={() => (explanationOpen = !explanationOpen)}>
              <span>{explanationOpen ? t(locale, 'action.hideExplanation') : t(locale, 'action.explain')}</span><span>{explanationOpen ? '−' : '+'}</span>
            </button>

            {#if explanationOpen}
              <div class="explanation-card">
                <p class="explanation-intro">{t(locale, 'explanation.calculatedBody')}</p>
                <div class="explanation-columns">
                   <div><h5>{t(locale, 'explanation.denominator')}</h5>{#if result.explanation.denominatorBasis.length > 0}<ul>{#each result.explanation.denominatorBasis as item (item)}<li>{item}</li>{/each}</ul>{:else}<p>{t(locale, 'explanation.none')}</p>{/if}</div>
                   <div><h5>{t(locale, 'explanation.excluded')}</h5>{#if result.explanation.excludedComponents.length > 0}<ul>{#each result.explanation.excludedComponents as item (item)}<li>{item}</li>{/each}</ul>{:else}<p>{t(locale, 'explanation.none')}</p>{/if}</div>
                </div>
                 <div class="explanation-columns">
                    <div><h5>{t(locale, 'explanation.unknown')}</h5>{#if result.explanation.unknownFields.length > 0}<ul>{#each result.explanation.unknownFields as item (item.path)}<li><strong>{item.label}</strong><span>{item.reasonCode}</span></li>{/each}</ul>{:else}<p>{t(locale, 'explanation.none')}</p>{/if}</div>
                    <div><h5>{t(locale, 'explanation.limitations')}</h5>{#if result.explanation.limitations.length > 0}<ul>{#each result.explanation.limitations as item (item)}<li>{item}</li>{/each}</ul>{:else}<p>{t(locale, 'explanation.none')}</p>{/if}</div>
                 </div>
                 <div class="explanation-columns">
                    <div><h5>{t(locale, 'explanation.roles')}</h5><ul>{#each result.explanation.roleParticipation as item (item.lineId)}<li><strong>{resultIngredientDisplayName(item.lineId, item.lineName)}</strong><span>{t(locale, `role.${item.role}`)} · {t(locale, `participation.${item.participation.metricFamily}`)}</span></li>{/each}</ul></div>
                    <div><h5>{t(locale, 'explanation.overrides')}</h5>{#if result.explanation.overrides.length > 0}<ul>{#each result.explanation.overrides as item (item.lineId)}<li><strong>{resultIngredientDisplayName(item.lineId, item.lineName)}</strong><span>{item.source === 'catalog' ? t(locale, 'ingredient.catalog') : t(locale, 'ingredient.custom')} · {item.fields.length > 0 ? item.fields.map((field) => t(locale, `field.${field}`)).join(', ') : ''}{item.availability ? ` · ${t(locale, 'ingredient.availability')}` : ''}</span></li>{/each}</ul>{:else}<p>{t(locale, 'explanation.none')}</p>{/if}</div>
                 </div>
                 <div class="provenance-line"><span>{t(locale, 'result.provenance')}</span><strong>{provenanceLabel(result.explanation.provenance.kind)}</strong><span>{t(locale, 'result.sourceDerived')}</span></div>
              </div>
            {/if}
          {:else}
            <div class="correction-callout"><strong>{t(locale, 'action.tryAgain')}</strong><p>{t(locale, 'formula.validation.correctMass')}</p></div>
          {/if}
        {/if}
      </section>
    </div>
  </main>

  <footer class="site-footer"><span>© 2026 DFI</span><span>{t(locale, 'footer.note')}</span></footer>
</div>

<style>
  :global(html) { background: #f5f1eb; }
  :global(body) { margin: 0; background: #f5f1eb; color: #242c29; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  :global(*) { box-sizing: border-box; }
  :global(button), :global(input), :global(select) { font: inherit; }
  :global(button), :global(a) { -webkit-tap-highlight-color: transparent; }
  :global(button) { cursor: pointer; }
  .app-shell { min-height: 100vh; background: radial-gradient(circle at 82% 9%, rgba(222, 161, 112, 0.17), transparent 26rem), #f5f1eb; }
  .topbar { height: 76px; padding: 0 clamp(1.25rem, 5vw, 5.6rem); display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(42, 50, 45, 0.13); }
  .brand { display: inline-flex; align-items: center; gap: 0.7rem; color: inherit; text-decoration: none; }
  .brand-mark { width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid #b87957; border-radius: 50%; color: #914d38; font-size: 0.58rem; font-weight: 800; letter-spacing: -0.05em; }
  .brand-copy { display: flex; flex-direction: column; gap: 0.15rem; }
  .brand-eyebrow, .section-kicker, .hero-kicker, .panel-number, .metric-label, .field span, .composition-label, .policy-strip, .site-footer, .draft-meta span, .result-block-heading span { font-size: 0.66rem; letter-spacing: 0.15em; text-transform: uppercase; }
  .brand-eyebrow { color: #7b4f3f; font-weight: 760; }
  .brand-name { font-size: 0.86rem; line-height: 0.92; font-weight: 740; letter-spacing: -0.03em; }
  .topnav { display: flex; gap: 0.9rem; align-items: center; font-size: 0.78rem; }
  .nav-current { color: #5f6c64; }
  .nav-divider { width: 1px; height: 16px; background: rgba(42, 50, 45, 0.18); }
  .help-link { color: #34483e; font-weight: 700; text-decoration: none; }
  .help-link:hover { color: #a24e37; }
  .language-link { display: inline-flex; gap: 0.45rem; align-items: center; color: #34483e; font-weight: 700; text-decoration: none; }
  .language-link:hover { color: #a24e37; }
  .language-dot, .status-dot { width: 6px; height: 6px; display: inline-block; background: #cc7853; border-radius: 50%; }
  main { width: min(1600px, calc(100% - 2rem)); margin: 0 auto; }
  .hero-section { min-height: 300px; padding: clamp(3rem, 8vw, 7rem) 0 3.6rem; display: grid; grid-template-columns: 1fr auto; align-items: end; position: relative; }
  .hero-kicker { display: flex; gap: 0.7rem; align-items: center; color: #8b4f3b; font-weight: 760; }
  .kicker-line { width: 36px; height: 1px; background: #c77954; }
  .hero-copy { max-width: 720px; grid-column: 1; }
  .hero-copy h1 { max-width: 690px; margin: 1.1rem 0 1rem; color: #263d34; font-family: Georgia, "Times New Roman", serif; font-size: clamp(3.2rem, 7vw, 7.8rem); font-weight: 400; line-height: 0.9; letter-spacing: -0.065em; }
  .hero-copy p { max-width: 560px; margin: 0; color: #58665d; font-size: 0.97rem; line-height: 1.65; }
  .hero-index { grid-column: 2; display: flex; align-items: center; gap: 0.65rem; padding-bottom: 0.35rem; color: #68736b; font-size: 0.68rem; letter-spacing: 0.12em; }
  .hero-index-rule { width: 52px; height: 1px; background: #bdc1b9; }
  .workspace-heading { padding: 1.5rem 0 1.25rem; display: flex; justify-content: space-between; gap: 2rem; align-items: end; border-top: 1px solid rgba(42, 50, 45, 0.16); }
  .section-kicker { margin: 0 0 0.55rem; color: #8b4f3b; font-weight: 800; }
  .workspace-heading h2 { margin: 0; color: #273f35; font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.8rem, 3.5vw, 3rem); font-weight: 400; letter-spacing: -0.05em; }
  .workspace-description { max-width: 600px; margin: 0.5rem 0 0; color: #5f6c64; font-size: 0.82rem; line-height: 1.6; }
  .draft-meta { display: flex; align-items: end; gap: 1.25rem; color: #7c827b; }
  .draft-meta div { display: flex; flex-direction: column; gap: 0.25rem; }
  .draft-meta strong { color: #334a40; font-size: 0.76rem; font-weight: 700; }
  .text-button { padding: 0 0 0.1rem; border: 0; border-bottom: 1px solid #b97558; background: transparent; color: #8f503a; font-size: 0.72rem; font-weight: 700; }
  .workspace-grid { display: grid; grid-template-columns: minmax(0, 1.03fr) minmax(0, 0.97fr); gap: 1rem; align-items: start; }
  .editor-panel { grid-column: 1; grid-row: 1; }
  .panel { background: rgba(255, 253, 249, 0.83); border: 1px solid rgba(65, 75, 67, 0.14); box-shadow: 0 18px 50px rgba(78, 65, 51, 0.045); }
  .panel-heading { min-height: 82px; padding: 1.25rem 1.35rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(65, 75, 67, 0.11); }
  .panel-heading > div { display: flex; align-items: center; gap: 0.8rem; }
  .panel-number { color: #9b5c42; font-weight: 800; }
  .panel-heading h3 { margin: 0; color: #2c453a; font-family: Georgia, "Times New Roman", serif; font-size: 1.25rem; font-weight: 400; letter-spacing: -0.03em; }
  .draft-status, .result-status { display: inline-flex; gap: 0.45rem; align-items: center; color: #5f6c64; font-size: 0.68rem; font-weight: 700; }
  .result-status.completed .status-dot, .result-status.partial .status-dot { background: #75936d; }
  .result-status.rejected .status-dot { background: #bc5e48; }
  .editor-section { padding: 1.35rem; border-bottom: 1px solid rgba(65, 75, 67, 0.11); }
  .subheading-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
  .subheading-row > div { display: flex; gap: 0.65rem; align-items: baseline; }
  .section-index { color: #9b5c42; font-family: Georgia, "Times New Roman", serif; font-size: 1rem; }
  .subheading-row h4, .result-block-heading h4 { margin: 0; color: #2f473c; font-family: Georgia, "Times New Roman", serif; font-size: 1.1rem; font-weight: 400; letter-spacing: -0.025em; }
  .small-button { padding: 0.4rem 0.65rem; border: 1px solid rgba(135, 81, 61, 0.48); background: transparent; color: #87513d; font-size: 0.7rem; font-weight: 750; }
  .small-button:hover { background: #fff7f0; border-color: #9b5c42; }
  .section-help { margin: 0.55rem 0 1.1rem 1.65rem; max-width: 550px; color: #58665d; font-size: 0.73rem; line-height: 1.5; }
  .line-list { display: flex; flex-direction: column; gap: 0.55rem; }
  .input-row { display: grid; grid-template-columns: 2rem minmax(0, 1fr) 6rem 6.7rem 1.25rem; gap: 0.6rem; align-items: end; padding: 0.65rem; background: #fbf8f3; border: 1px solid rgba(65, 75, 67, 0.16); }
  .row-index { align-self: center; color: #6d6d66; font-family: Georgia, "Times New Roman", serif; font-size: 0.9rem; }
  .field { min-width: 0; display: flex; flex-direction: column; gap: 0.3rem; }
  .field span { color: #5d6a61; font-size: 0.58rem; letter-spacing: 0.1em; font-weight: 700; }
  .field em { color: #5d6a61; font-style: normal; letter-spacing: 0; text-transform: none; }
  .field input, .field select, .composition-field select, .composition-value input { width: 100%; min-width: 0; height: 2.2rem; padding: 0 0.55rem; border: 1px solid #deddd6; border-radius: 0; outline: 0; background: #fffdfa; color: #33463d; font-size: 0.78rem; }
  .custom-name-input { margin-top: 0.05rem; }
  .field input:focus, .field select:focus, .composition-field select:focus, .composition-value input:focus { border-color: #b87859; box-shadow: 0 0 0 2px rgba(184, 120, 89, 0.12); }
  .mass-input { font-variant-numeric: tabular-nums; }
  .remove-button { width: 1.25rem; height: 2.2rem; padding: 0; border: 0; background: transparent; color: #647067; font-size: 1.2rem; line-height: 1; }
  .remove-button:hover { color: #b75f47; }
  .micro-note { margin: 0.85rem 0 0; color: #5f6a62; font-size: 0.67rem; line-height: 1.5; }
  .micro-icon { display: inline-grid; place-items: center; width: 14px; height: 14px; margin-right: 0.25rem; border: 1px solid #b38b75; border-radius: 50%; color: #8d573e; font-size: 0.57rem; font-weight: 800; }
  code { font-family: "SFMono-Regular", Consolas, monospace; font-size: 0.9em; }
  .ingredient-section { padding-bottom: 1.5rem; }
  .role-guide { margin: 0 0 1rem 1.65rem; border: 1px solid rgba(65, 75, 67, 0.11); background: #fbf8f3; color: #58665d; font-size: 0.68rem; }
  .role-guide summary { padding: 0.65rem 0.75rem; color: #52695a; cursor: pointer; font-weight: 750; }
  .role-guide p { margin: 0; padding: 0 0.75rem 0.55rem; line-height: 1.5; }
  .role-guide ul { margin: 0; padding: 0 0.75rem 0.75rem 1.8rem; display: grid; gap: 0.45rem; }
  .role-guide li { padding-left: 0.15rem; line-height: 1.4; }
  .role-guide li strong, .role-guide li span { display: block; }
  .role-guide li strong { color: #536b5a; font-size: 0.64rem; }
  .role-guide li span { color: #5e6d62; }
  .ingredient-list { display: flex; flex-direction: column; gap: 0.7rem; }
  .ingredient-card { padding: 0.75rem; background: #fbf8f3; border: 1px solid rgba(65, 75, 67, 0.1); }
  .ingredient-card-head { display: grid; grid-template-columns: 2rem minmax(0, 1fr) 6rem minmax(9rem, 0.75fr) 1.25rem; gap: 0.6rem; align-items: end; }
  .composition-block { margin: 1rem 0 0 2.6rem; padding-top: 0.8rem; border-top: 1px dashed rgba(65, 75, 67, 0.15); }
  .composition-heading { display: flex; justify-content: space-between; gap: 1rem; align-items: baseline; margin-bottom: 0.55rem; color: #657168; font-size: 0.68rem; font-weight: 750; }
  .composition-note { color: #6f6258; font-size: 0.6rem; font-weight: 500; }
  .composition-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.45rem; }
  .composition-field { min-width: 0; display: flex; flex-direction: column; gap: 0.3rem; }
  .composition-label { color: #5d6a61; font-size: 0.55rem; letter-spacing: 0.08em; font-weight: 700; }
  .composition-field select { height: 1.9rem; padding: 0 0.35rem; font-size: 0.67rem; }
  .composition-value { display: flex; align-items: center; position: relative; }
  .composition-value input { height: 1.75rem; padding-right: 1.1rem; font-size: 0.68rem; }
  .composition-value span { position: absolute; right: 0.35rem; color: #647067; font-size: 0.62rem; }
  .composition-label b { margin-left: 0.2rem; color: #a24e37; font-size: 0.7rem; }
  .ingredient-meta { margin: 0.9rem 0 0 2.6rem; padding-top: 0.75rem; display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(8rem, 0.7fr) minmax(0, 1.4fr); gap: 0.65rem; border-top: 1px solid rgba(65, 75, 67, 0.1); }
  .ingredient-source-line, .override-summary { min-width: 0; display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: baseline; color: #5f6b62; font-size: 0.62rem; line-height: 1.4; }
  .ingredient-source-line > span, .override-summary > span { color: #68746b; font-size: 0.54rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .ingredient-source-line strong, .override-summary strong { color: #45604e; font-weight: 700; }
  .ingredient-source-line small { color: #756b62; font-family: "SFMono-Regular", Consolas, monospace; font-size: 0.55rem; }
  .meta-field { min-width: 0; display: flex; flex-direction: column; gap: 0.28rem; }
  .meta-field > span { color: #5d6a61; font-size: 0.55rem; letter-spacing: 0.08em; font-weight: 700; text-transform: uppercase; }
  .meta-field em { color: #5d6a61; font-style: normal; letter-spacing: 0; text-transform: none; }
  .meta-field input, .meta-field select { width: 100%; min-width: 0; height: 1.85rem; padding: 0 0.45rem; border: 1px solid #deddd6; border-radius: 0; outline: 0; background: #fffdfa; color: #33463d; font-size: 0.68rem; }
  .meta-field input:focus, .meta-field select:focus, .process-field input:focus, .process-field select:focus { border-color: #b87859; box-shadow: 0 0 0 2px rgba(184, 120, 89, 0.12); }
  .availability-row { grid-column: 1 / -1; display: grid; grid-template-columns: minmax(0, 1fr) minmax(8rem, 0.7fr); gap: 0.65rem; align-items: end; }
  .process-panel { grid-column: 1 / -1; grid-row: 2; }
  .process-intro { padding: 0.9rem 1.35rem; display: flex; justify-content: space-between; gap: 1rem; border-bottom: 1px solid rgba(65, 75, 67, 0.11); color: #58665d; font-size: 0.72rem; line-height: 1.5; }
  .process-intro > div { max-width: 780px; }
  .process-intro p { margin: 0; }
  .process-intro .process-state-help { margin-top: 0.45rem; color: #6d7169; font-size: 0.65rem; }
  .process-intro > span { flex: 0 0 auto; color: #6b7069; font-family: "SFMono-Regular", Consolas, monospace; font-size: 0.61rem; }
  .process-grid { padding: 1.25rem 1.35rem 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; }
  .process-section { min-width: 0; margin: 0; padding: 0.85rem; border: 1px solid rgba(65, 75, 67, 0.13); background: #fbf8f3; }
  .process-section legend { padding: 0 0.35rem; color: #2f473c; font-family: Georgia, "Times New Roman", serif; font-size: 0.98rem; }
  .process-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.55rem; }
  .process-field { min-width: 0; display: flex; flex-direction: column; gap: 0.3rem; }
  .process-field > label { display: flex; flex-direction: column; gap: 0.28rem; }
  .process-field span { color: #5d6a61; font-size: 0.55rem; letter-spacing: 0.07em; font-weight: 700; text-transform: uppercase; }
  .process-field-label { display: block; }
  .process-field em { color: #5d6a61; font-style: normal; letter-spacing: 0; text-transform: none; }
  .process-field input, .process-field select { width: 100%; min-width: 0; height: 1.85rem; padding: 0 0.4rem; border: 1px solid #deddd6; border-radius: 0; outline: 0; background: #fffdfa; color: #33463d; font-size: 0.66rem; }
  .process-field input:disabled { background: #f0eee8; color: #7a817a; cursor: not-allowed; }
  .process-field input::placeholder { color: #8b918b; }
  .process-none-toggle { display: flex !important; flex-direction: row !important; align-items: center; gap: 0.35rem; color: #6b7069; font-size: 0.58rem; line-height: 1.25; letter-spacing: 0 !important; font-weight: 500 !important; text-transform: none !important; }
  .process-none-toggle input { width: auto; min-width: 0; height: auto; }
  .process-none-toggle span { color: inherit; font-size: inherit; letter-spacing: inherit; font-weight: inherit; text-transform: inherit; }
  .addition-heading { margin-top: 1rem; padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(65, 75, 67, 0.15); color: #5d6a61; font-size: 0.63rem; font-weight: 750; }
  .addition-help { margin: 0.55rem 0 0; max-width: 58rem; color: #6b7069; font-size: 0.68rem; line-height: 1.5; }
  .process-empty { margin: 0.7rem 0 0; color: #6b7069; font-size: 0.65rem; }
  .addition-list { display: flex; flex-direction: column; gap: 0.55rem; margin-top: 0.7rem; }
  .addition-step { padding: 0.65rem; border: 1px solid rgba(65, 75, 67, 0.12); background: #fffdfa; }
  .addition-step-head { display: grid; grid-template-columns: 4rem minmax(0, 1fr) 5.5rem 1.25rem; gap: 0.45rem; align-items: end; }
  .addition-lines { margin-top: 0.65rem; display: flex; flex-wrap: wrap; gap: 0.4rem 0.7rem; align-items: center; color: #5d6a61; font-size: 0.61rem; }
  .addition-lines > span { width: 100%; color: #68746b; font-size: 0.54rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .addition-lines label { display: inline-flex; gap: 0.25rem; align-items: center; }
  .addition-lines input { accent-color: #496b57; }
  .process-footer { padding: 1rem 1.35rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; border-top: 1px solid rgba(65, 75, 67, 0.11); }
  .process-state-note { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; color: #5f6b62; font-size: 0.61rem; }
  .process-result { margin: 0 1.35rem 0.85rem; padding: 0.75rem 0.85rem; display: flex; justify-content: space-between; border: 1px solid #d2dfd1; background: #f0f6ef; color: #45634d; }
  .process-result.partial { border-color: #e1cdb9; background: #fff7ee; color: #8d5e44; }
  .process-result.rejected { border-color: #e7c5ba; background: #fff1ec; color: #a04d3f; }
  .process-result strong, .process-result span { display: block; }
  .process-result strong { font-size: 0.73rem; }
  .process-result span { margin-top: 0.25rem; font-size: 0.63rem; }
  .process-partial-note { margin-bottom: 0.9rem; }
  .process-diagnostics { margin-bottom: 1rem; }
  .editor-footer { padding: 1rem 1.35rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
  .unit-lock { display: flex; align-items: center; gap: 0.45rem; color: #5d6a61; font-size: 0.7rem; }
  .unit-lock strong { color: #a15c44; font-size: 0.63rem; letter-spacing: 0.1em; }
  .lock-mark { color: #8f5b42; transform: rotate(-45deg); }
  .primary-button { display: inline-flex; gap: 1.2rem; align-items: center; padding: 0.72rem 0.85rem 0.72rem 1rem; border: 0; background: #2f5144; color: #fffdf8; font-size: 0.72rem; font-weight: 750; }
  .primary-button:hover { background: #244338; }
  .button-arrow { color: #e3b397; font-size: 1rem; }
  .result-panel { grid-column: 2; grid-row: 1; min-height: 600px; }
  .result-heading { background: rgba(249, 245, 237, 0.68); }
  .result-status.idle { color: #6f756d; }
  .analysis-handoff { margin: 1rem 1.25rem 0; padding: 0.9rem; border: 1px solid #cbdccd; background: #f5faf4; color: #45634d; }
  .analysis-handoff.partial { border-color: #e1cdb9; background: #fff8ef; color: #8d5e44; }
  .analysis-handoff.rejected, .analysis-handoff.conflict { border-color: #e7c5ba; background: #fff4ef; color: #a04d3f; }
  .analysis-handoff.idle { border-color: rgba(65, 75, 67, 0.15); background: #fbf8f3; color: #50675a; }
  .handoff-heading { display: flex; justify-content: space-between; gap: 0.7rem; align-items: start; }
  .handoff-kicker { display: block; color: #8b5c46; font-size: 0.55rem; font-weight: 800; letter-spacing: 0.11em; text-transform: uppercase; }
  .handoff-heading h4 { margin: 0.25rem 0 0; color: #345040; font-family: Georgia, "Times New Roman", serif; font-size: 1.05rem; font-weight: 400; letter-spacing: -0.025em; }
  .handoff-status { display: inline-flex; flex: 0 0 auto; gap: 0.35rem; align-items: center; color: inherit; font-size: 0.61rem; font-weight: 750; text-align: right; }
  .handoff-status .status-dot { background: currentColor; }
  .handoff-help, .handoff-idle-note { margin: 0.6rem 0 0; color: #5d6b61; font-size: 0.67rem; line-height: 1.5; }
  .handoff-path-field { display: flex; flex-direction: column; gap: 0.28rem; margin-top: 0.7rem; }
  .handoff-path-field span { color: #5d6a61; font-size: 0.55rem; font-weight: 750; letter-spacing: 0.07em; text-transform: uppercase; }
  .handoff-path-field select { width: 100%; height: 1.9rem; padding: 0 0.45rem; border: 1px solid #d7ddd5; border-radius: 0; background: #fffdfa; color: #33463d; font-size: 0.66rem; }
  .handoff-path-field select:focus { border-color: #b87859; box-shadow: 0 0 0 2px rgba(184, 120, 89, 0.12); outline: 0; }
  .handoff-button { width: 100%; margin-top: 0.75rem; padding: 0.62rem 0.7rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid #52735e; background: #edf6ee; color: #345b43; font-size: 0.68rem; font-weight: 750; text-align: left; }
  .handoff-button:hover { background: #e2f0e4; }
  .handoff-outcome { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid rgba(65, 75, 67, 0.13); }
  .handoff-outcome-heading { display: flex; justify-content: space-between; gap: 0.7rem; align-items: baseline; }
  .handoff-outcome-heading strong, .handoff-outcome-heading span { display: block; }
  .handoff-outcome-heading strong { color: inherit; font-size: 0.72rem; }
  .handoff-outcome-heading span:not(.handoff-revisions) { margin-top: 0.2rem; color: #5d6b61; font-size: 0.62rem; line-height: 1.4; }
  .handoff-revisions { flex: 0 0 auto; color: #6b7069; font-family: "SFMono-Regular", Consolas, monospace; font-size: 0.56rem; }
  .handoff-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 0.45rem; margin-top: 0.65rem; }
  .handoff-metrics > div { padding: 0.55rem; border: 1px solid rgba(65, 75, 67, 0.13); background: rgba(255, 253, 249, 0.68); }
  .handoff-metrics span, .handoff-metrics strong, .handoff-metrics small { display: block; }
  .handoff-metrics span { color: #5e6d62; font-size: 0.54rem; font-weight: 750; letter-spacing: 0.05em; text-transform: uppercase; }
  .handoff-metrics strong { margin-top: 0.25rem; color: #345b43; font-family: Georgia, "Times New Roman", serif; font-size: 1.1rem; font-weight: 400; }
  .handoff-metrics small { margin-top: 0.15rem; color: #68746b; font-size: 0.55rem; }
  .handoff-meta { display: flex; flex-wrap: wrap; gap: 0.35rem 0.8rem; margin-top: 0.6rem; color: #68746b; font-size: 0.55rem; }
  .handoff-meta code { color: #526b59; font-size: 0.55rem; }
  .handoff-diagnostics { margin: 0.75rem 0 0; }
  .handoff-limitations { margin-top: 0.7rem; padding-top: 0.65rem; border-top: 1px solid rgba(65, 75, 67, 0.13); }
  .handoff-limitations h5 { margin: 0 0 0.35rem; color: #6f5b4d; font-size: 0.6rem; }
  .handoff-limitations ul { margin: 0; padding-left: 1rem; color: #5d665e; font-size: 0.62rem; line-height: 1.45; }
  .handoff-limitations code { display: block; margin-top: 0.15rem; color: #806f65; font-size: 0.53rem; }
  .handoff-no-limitations { margin: 0.7rem 0 0; color: #5d6b61; font-size: 0.62rem; }
  .handoff-recovery { margin: 0.7rem 0 0; padding-top: 0.65rem; border-top: 1px dashed rgba(160, 77, 63, 0.25); color: #7b5847; font-size: 0.62rem; line-height: 1.45; }
  .empty-result { min-height: 520px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2.5rem; text-align: center; }
  .empty-orbit { width: 94px; height: 94px; margin-bottom: 1.4rem; position: relative; border: 1px solid rgba(173, 116, 85, 0.35); border-radius: 50%; }
  .empty-orbit::before, .empty-orbit::after { content: ''; position: absolute; inset: 13px; border: 1px dashed rgba(94, 121, 102, 0.32); border-radius: 50%; }
  .empty-orbit::after { inset: 30px; border-style: solid; border-color: rgba(173, 116, 85, 0.45); }
  .empty-orbit span { position: absolute; width: 7px; height: 7px; background: #b86f50; border-radius: 50%; }
  .empty-orbit span:nth-child(1) { top: 7px; left: 44px; }
  .empty-orbit span:nth-child(2) { right: 12px; bottom: 25px; background: #6d8a72; }
  .empty-orbit span:nth-child(3) { bottom: 17px; left: 19px; background: #d7ae8d; }
  .empty-result h4 { max-width: 300px; margin: 0; color: #385243; font-family: Georgia, "Times New Roman", serif; font-size: 1.35rem; font-weight: 400; letter-spacing: -0.035em; }
  .empty-result p { max-width: 320px; margin: 0.7rem 0 0; color: #5f6a62; font-size: 0.76rem; line-height: 1.6; }
  .outcome-banner { display: flex; gap: 0.7rem; align-items: center; margin: 1rem 1.25rem 0; padding: 0.75rem 0.85rem; border: 1px solid #d2dfd1; background: #f0f6ef; color: #45634d; }
  .outcome-banner.partial { border-color: #e1cdb9; background: #fff7ee; color: #8d5e44; }
  .outcome-banner.rejected { border-color: #e7c5ba; background: #fff1ec; color: #a04d3f; }
  .outcome-icon { width: 24px; height: 24px; display: grid; place-items: center; border: 1px solid currentColor; border-radius: 50%; font-size: 0.72rem; font-weight: 800; }
  .outcome-banner strong, .outcome-banner span { display: block; }
  .outcome-banner strong { font-size: 0.79rem; }
  .outcome-banner span { margin-top: 0.15rem; opacity: 1; font-size: 0.66rem; }
  .diagnostic-list { display: flex; flex-direction: column; gap: 0.55rem; margin: 0.75rem 1.25rem 0; }
  .diagnostic { padding: 0.7rem 0.8rem; border-left: 2px solid #bd6750; background: #fff7f1; }
  .diagnostic.warning { border-left-color: #bf8659; background: #fff9f0; }
  .diagnostic-topline { display: flex; justify-content: space-between; gap: 0.8rem; align-items: start; color: #89503e; font-size: 0.72rem; }
  .diagnostic code { flex: 0 0 auto; color: #7b5847; font-size: 0.57rem; }
  .diagnostic p { margin: 0.35rem 0 0; color: #5d665e; font-size: 0.69rem; line-height: 1.45; }
  .diagnostic-path { display: block; margin-top: 0.45rem; color: #806f65; font-family: "SFMono-Regular", Consolas, monospace; font-size: 0.58rem; }
  .partial-note { display: flex; gap: 0.6rem; margin: 0.9rem 1.25rem 0; padding: 0.7rem 0.8rem; border: 1px solid #ebd7c3; background: #fffaf4; color: #705441; }
  .partial-note > span { color: #8f5b42; }
  .partial-note p { margin: 0; font-size: 0.7rem; line-height: 1.5; }
  .metric-grid { display: grid; grid-template-columns: 1.35fr 1fr 1fr; gap: 0.55rem; margin: 1rem 1.25rem 0; }
  .metric-card { min-height: 105px; padding: 0.8rem; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid rgba(65, 75, 67, 0.12); background: #fbf8f3; }
  .metric-card.metric-featured { border-color: #bbd0c0; background: #eff6f0; }
  .metric-label { color: #5e6d62; font-size: 0.55rem; letter-spacing: 0.11em; font-weight: 750; }
  .metric-card strong { margin: 0.5rem 0; color: #304c3d; font-family: Georgia, "Times New Roman", serif; font-size: 1.65rem; font-weight: 400; letter-spacing: -0.05em; }
  .metric-card strong small { font-family: Inter, ui-sans-serif, sans-serif; font-size: 0.72rem; letter-spacing: 0; }
  .metric-foot { color: #5e6d62; font-size: 0.62rem; }
  .semantic-tag { display: inline-flex; padding: 0.18rem 0.32rem; border-radius: 2px; font-size: 0.56rem; font-weight: 750; }
  .semantic-tag.calculated { background: #dcebdd; color: #3f6048; }
  .semantic-tag.estimated { background: #f6e6d3; color: #765333; }
  .semantic-tag.heuristic { background: #e9e1ef; color: #634d70; }
  .result-block { margin: 1.2rem 1.25rem 0; }
  .result-block-heading { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 0.55rem; border-bottom: 1px solid rgba(65, 75, 67, 0.15); }
  .result-block-heading span { color: #626a63; font-size: 0.56rem; letter-spacing: 0.08em; }
  .data-table { font-size: 0.7rem; }
  .table-row { display: grid; grid-template-columns: 1.35fr 0.75fr 0.8fr 0.95fr; gap: 0.5rem; align-items: center; min-height: 39px; border-bottom: 1px solid rgba(65, 75, 67, 0.13); color: #5d6a61; }
  .table-row > span:not(:first-child) { font-variant-numeric: tabular-nums; }
  .table-head { min-height: 30px; color: #626a63; font-size: 0.55rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .table-name { color: #3c5748; font-weight: 700; }
  .ingredient-result-row { grid-template-columns: 1.25fr 0.95fr 0.65fr 0.65fr; }
  .table-name small { display: flex; flex-wrap: wrap; gap: 0.2rem; margin-top: 0.25rem; font-weight: 400; }
  .state-mini { padding: 0.14rem 0.22rem; color: #50675a; background: #edf1eb; font-size: 0.5rem; }
  .state-mini.unknown { color: #8a553c; background: #fff0e5; }
  .state-mini.none { color: #5f6761; background: #f0f0ed; }
  .composition-metrics { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.45rem; margin-top: 0.6rem; }
  .composition-metric-card { padding: 0.6rem; border: 1px solid #dce7da; background: #f3f8f2; }
  .composition-metric-card.unavailable { border-color: #ead9cb; background: #fff8f1; }
  .composition-metric-card > span { display: block; color: #5b6b60; font-size: 0.59rem; font-weight: 700; }
  .composition-metric-card strong { display: block; margin: 0.3rem 0; color: #46604b; font-family: Georgia, "Times New Roman", serif; font-size: 1rem; font-weight: 400; }
  .composition-metric-card small { display: block; color: #5f6e63; font-size: 0.55rem; line-height: 1.3; }
  .composition-metric-card.unavailable strong, .composition-metric-card.unavailable small { color: #8f5b42; }
  .policy-strip { display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: center; margin: 1rem 1.25rem 0; padding: 0.7rem 0.8rem; color: #5e6a61; background: #f5f1ea; font-size: 0.56rem; letter-spacing: 0.07em; }
  .policy-strip strong { color: #526b59; font-size: 0.62rem; font-weight: 600; letter-spacing: 0; line-height: 1.45; text-transform: none; }
  .policy-strip code { color: #526b59; font-size: 0.62rem; letter-spacing: 0; }
  .policy-separator { color: #8f6f59; }
  .explanation-toggle { width: calc(100% - 2.5rem); margin: 1rem 1.25rem 0; padding: 0.8rem 0; display: flex; justify-content: space-between; border: 0; border-top: 1px solid rgba(65, 75, 67, 0.15); background: transparent; color: #3e5e4c; font-size: 0.7rem; font-weight: 750; text-align: left; }
  .explanation-card { margin: 0 1.25rem 1.25rem; padding: 1rem; border: 1px solid #dbe5da; background: #f5faf4; }
  .explanation-intro { margin: 0 0 0.9rem; color: #58665d; font-size: 0.69rem; line-height: 1.55; }
  .explanation-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 0.8rem 0; border-top: 1px solid rgba(78, 110, 83, 0.13); }
  .explanation-columns h5 { margin: 0 0 0.45rem; color: #59715e; font-size: 0.64rem; }
  .explanation-columns ul { margin: 0; padding-left: 1rem; color: #5f6b62; font-size: 0.65rem; line-height: 1.5; }
  .explanation-columns p { margin: 0; color: #5d665e; font-size: 0.65rem; }
  .explanation-columns li span { display: block; color: #7b5847; font-family: "SFMono-Regular", Consolas, monospace; font-size: 0.55rem; }
  .provenance-line { display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: baseline; padding-top: 0.75rem; border-top: 1px solid rgba(78, 110, 83, 0.13); color: #5f6b62; font-size: 0.63rem; }
  .provenance-line strong { color: #42604a; }
  .correction-callout { margin: 1rem 1.25rem; padding: 1.2rem; border: 1px dashed #d9a08c; background: #fff8f3; }
  .correction-callout strong { color: #985341; font-family: Georgia, "Times New Roman", serif; font-size: 1.05rem; font-weight: 400; }
  .correction-callout p { margin: 0.4rem 0 0; color: #6f6258; font-size: 0.72rem; line-height: 1.5; }
  .site-footer { width: min(1600px, calc(100% - 2rem)); margin: 0 auto; padding: 2.2rem 0 2.8rem; display: flex; justify-content: space-between; color: #5f6860; font-size: 0.57rem; letter-spacing: 0.08em; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
  @media (max-width: 1080px) { .workspace-grid { grid-template-columns: 1fr; } .editor-panel, .result-panel, .process-panel { grid-column: 1; } .editor-panel { grid-row: 1; } .result-panel { grid-row: 2; min-height: auto; } .process-panel { grid-row: 3; } .process-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .empty-result { min-height: 360px; } }
  @media (max-width: 720px) { main, .site-footer { width: min(100% - 1.2rem, 1400px); } .topbar { height: 68px; padding: 0 0.8rem; } .brand-name { font-size: 0.72rem; } .brand-eyebrow { font-size: 0.52rem; } .nav-current { display: none; } .hero-section { min-height: 300px; padding: 3.7rem 0 2.5rem; display: block; } .hero-copy h1 { font-size: clamp(3rem, 16vw, 5.6rem); } .hero-copy p { font-size: 0.88rem; } .hero-index { margin-top: 2rem; justify-content: flex-end; } .workspace-heading { display: block; } .draft-meta { margin-top: 1.3rem; justify-content: space-between; } .panel-heading { padding: 1rem; } .editor-section { padding: 1rem; } .input-row { grid-template-columns: 1.5rem minmax(0, 1fr) 5.5rem 1.25rem; } .field-blend { grid-column: 2 / 4; } .ingredient-card-head { grid-template-columns: 1.5rem minmax(0, 1fr) 5.5rem 1.25rem; } .field-role { grid-column: 2 / 4; } .role-guide { margin-left: 0; } .composition-block { margin-left: 0; } .composition-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .composition-heading { display: block; } .composition-note { display: block; margin-top: 0.25rem; } .ingredient-meta { margin-left: 0; grid-template-columns: 1fr 1fr; } .availability-row { grid-column: 1 / -1; grid-template-columns: 1fr; } .process-intro { padding: 0.9rem 1rem; display: block; } .process-intro > span { display: block; margin-top: 0.45rem; } .process-grid { padding: 1rem; grid-template-columns: 1fr; } .process-footer { padding: 1rem; align-items: stretch; flex-direction: column; } .addition-step-head { grid-template-columns: 3.7rem minmax(0, 1fr) 4.6rem 1.25rem; } .editor-footer { padding: 1rem; align-items: stretch; flex-direction: column; } .primary-button { justify-content: space-between; } .analysis-handoff { margin-left: 1rem; margin-right: 1rem; } .outcome-banner, .diagnostic-list, .partial-note, .metric-grid, .result-block, .policy-strip, .explanation-card { margin-left: 1rem; margin-right: 1rem; } .metric-grid { grid-template-columns: 1fr 1fr; } .metric-featured { grid-column: 1 / -1; } .table-row { grid-template-columns: 1.15fr 0.75fr 0.65fr 0.7fr; font-size: 0.64rem; } .composition-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } .explanation-toggle { width: calc(100% - 2rem); margin-left: 1rem; margin-right: 1rem; } .site-footer { gap: 0.6rem; flex-wrap: wrap; } }
</style>
