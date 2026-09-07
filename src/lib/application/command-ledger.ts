export type LocalCommandOutcome = 'completed' | 'replayed' | 'conflict';
export type LocalCommandConflict = 'STALE_REVISION' | 'COMMAND_REPLAY_MISMATCH';

export interface LocalCommandEnvelope {
  commandId: string;
  fingerprint: string;
  currentRevision: number;
  expectedRevision?: number;
}

export interface LocalCommandResult<T> {
  outcome: LocalCommandOutcome;
  value?: T;
  revision: number;
  conflict?: LocalCommandConflict;
}

interface LedgerEntry<T> {
  fingerprint: string;
  value: T;
  revision: number;
}

export interface LocalCommandLedger {
  execute<T>(envelope: LocalCommandEnvelope, operation: () => { value: T; revision: number }): LocalCommandResult<T>;
  clear(): void;
}

export function createLocalCommandLedger(): LocalCommandLedger {
  const entries = new Map<string, LedgerEntry<unknown>>();

  return {
    execute<T>(
      envelope: LocalCommandEnvelope,
      operation: () => { value: T; revision: number },
    ): LocalCommandResult<T> {
      const previous = entries.get(envelope.commandId);
      if (previous) {
        if (previous.fingerprint !== envelope.fingerprint) {
          return {
            outcome: 'conflict',
            value: previous.value as T,
            revision: previous.revision,
            conflict: 'COMMAND_REPLAY_MISMATCH',
          };
        }
        return {
          outcome: 'replayed',
          value: previous.value as T,
          revision: previous.revision,
        };
      }

      if (envelope.expectedRevision !== undefined && envelope.expectedRevision !== envelope.currentRevision) {
        return {
          outcome: 'conflict',
          revision: envelope.currentRevision,
          conflict: 'STALE_REVISION',
        };
      }

      const executed = operation();
      entries.set(envelope.commandId, {
        fingerprint: envelope.fingerprint,
        value: executed.value,
        revision: executed.revision,
      });
      return { outcome: 'completed', value: executed.value, revision: executed.revision };
    },
    clear() {
      entries.clear();
    },
  };
}
