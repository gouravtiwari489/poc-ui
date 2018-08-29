
export class TableList {
  tables: Table[];
  cyclicDependencyFound: boolean;
}

export class Table {
  tableName: string;
  fields: Field[];
  constraints: Constraint[];
  forigenKeys: ForigenKey[];
  checkConstraints: CheckConstraint[];
  fieldsNames: string[];
}

export class Field {
  columnName: string;
  dataType: string;
  length: string;
  mappingCategeries: MappingCategory[];
  mappedCategory: string;
  mappedType: string;
  defaultValue: string;
}

export class MappingCategory {
  mappingCategory: string;
  mappingType: string;
  
  constructor(mappingCategory, mappingType) {
    this.mappingCategory = mappingCategory;
    this.mappingType = mappingType;
  }
}

export class Constraint {
  constraintName: string;
  columns: string[];
  constraintType: string;
}

export class ForigenKey {
  constraintName: string;
  referenceTable: string;
  referenceColumn: string;
  keyName: string;
}

export class CheckConstraint {
  constraintName: string;
  value: string[];
}
