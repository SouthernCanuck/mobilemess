import { ExtendableError } from './ExtendableError';

export class UnreachableCaseError extends ExtendableError {
  constructor(val: never) {
    super(`Unreachable case: ${JSON.stringify(val)}`);
  }
}
