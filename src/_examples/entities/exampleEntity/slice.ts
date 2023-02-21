import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Example } from './types';

const initialState: Example = {
    firstField: '',
    secondField: [],
};

const example = createSlice({
    name: 'example',
    initialState: initialState,
    reducers: {
        setFirstField: (state, action: PayloadAction<string>) => {
            state.firstField = action.payload;
            return state;
        },
        pushToSecondField: (state, action: PayloadAction<number>) => {
            state.secondField.push(action.payload);
            return state;
        },
    },
});

export const { setFirstField, pushToSecondField } = example.actions;

export default example.reducer;
