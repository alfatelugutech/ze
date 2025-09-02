import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Position {
  _id: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
  side: 'BUY' | 'SELL';
  createdAt: string;
}

export interface Portfolio {
  _id: string;
  userId: string;
  cashBalance: number;
  totalValue: number;
  totalPnL: number;
  positions: Position[];
  createdAt: string;
  updatedAt: string;
}

interface PortfolioState {
  portfolio: Portfolio | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  portfolio: null,
  isLoading: false,
  error: null,
};

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await axios.get('/api/trading/portfolio', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch portfolio');
    }
  }
);

export const placeOrder = createAsyncThunk(
  'portfolio/placeOrder',
  async (orderData: { symbol: string; quantity: number; side: 'BUY' | 'SELL'; orderType: 'MARKET' | 'LIMIT'; price?: number }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await axios.post('/api/trading/order', orderData, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to place order');
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updatePosition: (state, action: PayloadAction<Position>) => {
      if (state.portfolio) {
        const index = state.portfolio.positions.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.portfolio.positions[index] = action.payload;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.portfolio = action.payload;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        // Refresh portfolio after order
        if (state.portfolio) {
          state.portfolio = { ...state.portfolio, ...action.payload };
        }
      });
  },
});

export const { clearError, updatePosition } = portfolioSlice.actions;
export default portfolioSlice.reducer;
