import * as t from 'io-ts';
import createValidator from 'helpers/validation';

import { loadJsonFile } from 'helpers/fileSystem';
import { fileDBName } from 'constants/fileDB';

import { UnreachableCaseError } from 'helpers/UnreachableCaseError';
import { PersistentData as v4PersistentData, loader as v4loader } from './v4loader';
import { PersistentData as v5PersistentData, loader as v5loader } from './v5loader';
import { PersistentData as v6PersistentData, loader as v6loader } from './v6loader';
import { PersistentData as v7PersistentData, loader as v7loader } from './v7loader';
import { ReadData } from './types';

const PersistentData = t.union([
  v4PersistentData,
  v5PersistentData,
  v6PersistentData,
  v7PersistentData,
]);
type PersistentData = t.TypeOf<typeof PersistentData>

const validatePersistentData = createValidator(PersistentData);

export default function* read(): Generator<Promise<unknown>, ReadData | undefined, unknown> {
  const content = yield loadJsonFile(fileDBName);
  if (!content) {
    return undefined;
  }
  const data = validatePersistentData(content);

  switch (data.version) {
    case 4: return v4loader(data);
    case 5: return v5loader(data);
    case 6: return v6loader(data);
    case 7: return v7loader(data);
    default: throw new UnreachableCaseError(data);
  }
}
