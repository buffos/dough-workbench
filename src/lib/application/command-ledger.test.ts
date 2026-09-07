import { describe, expect, it } from 'vitest';
import { createLocalCommandLedger } from './command-ledger';

describe('local command ledger', () => {
  it.each(['line', 'component', 'step'])('does not duplicate a replayed %s', (kind) => {
    const ledger = createLocalCommandLedger();
    let revision = 1;
    const items: string[] = [];

    const execute = () => ledger.execute({
      commandId: `add-${kind}-1`,
      fingerprint: `add-${kind}:item-1`,
      currentRevision: revision,
      expectedRevision: revision,
    }, () => {
      items.push('item-1');
      revision += 1;
      return { value: 'item-1', revision };
    });

    const first = execute();
    const replay = execute();

    expect(first.outcome).toBe('completed');
    expect(replay.outcome).toBe('replayed');
    expect(items).toEqual(['item-1']);
    expect(revision).toBe(2);
  });

  it('returns a stale conflict before applying a newer command', () => {
    const ledger = createLocalCommandLedger();
    const result = ledger.execute({
      commandId: 'add-line-stale',
      fingerprint: 'add-line:item-2',
      currentRevision: 3,
      expectedRevision: 2,
    }, () => ({ value: 'item-2', revision: 4 }));

    expect(result).toMatchObject({ outcome: 'conflict', conflict: 'STALE_REVISION', revision: 3 });
  });

  it('rejects reuse of a command identity with a different payload', () => {
    const ledger = createLocalCommandLedger();
    const first = ledger.execute({ commandId: 'same-command', fingerprint: 'payload-a', currentRevision: 1, expectedRevision: 1 }, () => ({ value: 'a', revision: 2 }));
    const second = ledger.execute({ commandId: 'same-command', fingerprint: 'payload-b', currentRevision: 2, expectedRevision: 2 }, () => ({ value: 'b', revision: 3 }));

    expect(first.outcome).toBe('completed');
    expect(second).toMatchObject({ outcome: 'conflict', conflict: 'COMMAND_REPLAY_MISMATCH', value: 'a' });
  });
});
