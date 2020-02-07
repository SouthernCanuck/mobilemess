/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');

const fieldArrayRawData = fs.readFileSync('standard_inspection.json', 'utf8');
const fieldArray = JSON.parse(fieldArrayRawData);

const fieldMap = {};
const sections = {};

fieldArray.forEach(fieldDefinition => {
  fieldMap[fieldDefinition.id] = fieldDefinition;
  const sectionId = fieldDefinition.section;

  if (fieldDefinition.section) {
    const fieldForSection = { id: fieldDefinition.id, name: fieldDefinition.name || '' };
    const section = sections[sectionId];
    if (section) {
      section.properties.push(fieldForSection);
    } else {
      sections[sectionId] = {
        sectionId,
        properties: [
          fieldForSection,
        ],
      };
    }
  }
});

fs.writeFileSync('backendFieldMap.json', JSON.stringify(fieldMap, '\t', '  '));

fs.writeFileSync('fieldsBySection.json', JSON.stringify(sections, '\t', '  '));
