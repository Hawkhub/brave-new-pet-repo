import { createAsyncThunk } from '@reduxjs/toolkit';
import { NO_ERROR_MESSAGE } from 'store/consts';
import { ExampleRootState } from './types';

export const getExampleThunk = createAsyncThunk<
    void,
    string,
    { rejectValue: string; state: ExampleRootState }
>('example/getExampleThunk', async (params, thunkAPI) => {
    try {
        const responseData: any = await console.log('fetch', params);
        return responseData.result;
    } catch (error) {
        if (error instanceof Error) {
            return thunkAPI.rejectWithValue(error.message);
        }
        return thunkAPI.rejectWithValue(NO_ERROR_MESSAGE);
    }
});
