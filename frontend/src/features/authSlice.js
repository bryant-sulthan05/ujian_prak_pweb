import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

let userFromStorage = null;

try {
    const storedUser = localStorage.getItem('user');
    userFromStorage = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
    userFromStorage = null;
    localStorage.removeItem('user');
}


const initialState = {
    user: userFromStorage,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
};


export const LoginUser = createAsyncThunk("user/LoginUser", async (users, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:5000/login', {
            email: users.email,
            password: users.password
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
    try {
        const response = await axios.get('http://localhost:5000/me');
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const Logout = createAsyncThunk("user/Logout", async () => {
    await axios.delete('http://localhost:5000/logout');
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(LoginUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        });
        builder.addCase(LoginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        builder.addCase(getMe.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(getMe.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });
        builder.addCase(Logout.fulfilled, (state) => {
            state.user = null;
            state.isSuccess = false;
            localStorage.removeItem('user');
        });
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;