import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import productReducer from './productSlice';
import orderReducer from './orderSlice';
import authReducer from './authSlice';
import userReducer from './userSlice';
import settingsReducer from './admin/settingsSlice';
import categoryReducer from './admin/categorySlice';
import wishlistReducer from './wishlistSlice';
import reviewsReducer from './reviewsSlice';
import reviewsadminReducer from './admin/reviewSlice';


const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productReducer,
        orders: orderReducer,
        auth: authReducer,
        user: userReducer,
        settings: settingsReducer,
        categories:categoryReducer,
        wishlist: wishlistReducer,
        reviews: reviewsReducer,
        reviewsadmin: reviewsadminReducer
    },
});

export default store;