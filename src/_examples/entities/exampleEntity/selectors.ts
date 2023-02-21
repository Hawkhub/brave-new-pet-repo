import { createSelector } from '@reduxjs/toolkit';
import { ExampleRootState } from './types';

export const getExampleFirstField = (state: ExampleRootState) => {
    return state.example.firstField;
};

export const getExampleSecondField = (state: ExampleRootState) => {
    return state.example.secondField;
};

export const getHeavyComputingSelector = createSelector(
    [getExampleFirstField, getExampleSecondField],
    (firstField, secondField): string[] => {
        // Тяжелые вычисления
        const result = secondField.sort().map((value) => firstField + value);

        return result;
    }
);
