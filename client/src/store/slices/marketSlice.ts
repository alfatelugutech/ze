import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface StockQuote {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  lastUpdated: string;
}

export interface WatchlistItem {
  _id: string;
  symbol: string;
  addedAt: string;
}

interface MarketState {
  quotes: StockQuote[];
  watchlist: WatchlistItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MarketState = {
  quotes: [],
  watchlist: [],
  isLoading: false,
  error: null,
};

export const fetchMarketQuotes = createAsyncThunk(
  'market/fetchQuotes',
  async (symbols: string[], { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/market/quotes', {
        params: { symbols: symbols.join(',') }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch market quotes');
    }
  }
);

export const fetchWatchlist = createAsyncThunk(
  'market/fetchWatchlist',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await axios.get('/api/market/watchlist', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch watchlist');
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  'market/addToWatchlist',
  async (symbol: string, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await axios.post('/api/market/watchlist', { symbol }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add to watchlist');
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  'market/removeFromWatchlist',
  async (symbol: string, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      await axios.delete(`/api/market/watchlist/${symbol}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      return symbol;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove from watchlist');
    }
  }
);

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateQuote: (state, action: PayloadAction<StockQuote>) => {
      const index = state.quotes.findIndex(q => q.symbol === action.payload.symbol);
      if (index !== -1) {
        state.quotes[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketQuotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMarketQuotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quotes = action.payload;
      })
      .addCase(fetchMarketQuotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.watchlist = action.payload;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.watchlist.push(action.payload);
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.watchlist = state.watchlist.filter(item => item.symbol !== action.payload);
      });
  },
});

export const { clearError, updateQuote } = marketSlice.actions;
export default marketSlice.reducer;
