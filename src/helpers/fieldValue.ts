import { ROOT, FormPath } from 'types/fieldValue';

export const getFieldId = (path: FormPath): string => path
  .map((pathItem) => `${pathItem.id}[${pathItem.index ?? 0}]`)
  .join('/');


export const getFieldDefinitionId = (path: FormPath): string => path[path.length - 1].id;

/**
 * replace last definitionId in the path, but keep index
 * it is need to access to form.field on the same "level" of original field
 */
export const getFieldPathWithDefinitionId = (path: FormPath, definitionId: string): FormPath => {
  const lastPathItem = path[path.length - 1];
  const newPath = [...path];
  newPath[newPath.length - 1] = {
    id: definitionId,
    index: lastPathItem.index,
  };
  return newPath;
};

/**
 * sections look like root fields in the tree
 */
export const getSectionFieldPath = (
  sectionId: string,
  sectionIndex: number,
  definitionId: string,
): FormPath => [
  { id: ROOT },
  { id: sectionId, index: sectionIndex },
  { id: definitionId },
];
