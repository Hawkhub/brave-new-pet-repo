// Стейт данного слайса
export type Example = {
    firstField: string;
    secondField: number[];
};

// RootState нужен для переиспользования общих слайсов в воркспейсах с разным деревом стейта
export type ExampleRootState = unknown & {
    example: Example;
};
