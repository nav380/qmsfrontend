import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './slices/userSlice';
import orderReducer from './slices/LineMasterSlice';
import defectReducer from './slices/DefectMasterSlice';
import sewingInputReducer from './slices/SewingInputSlice';
import rejectReducer from './slices/RejectMasterSlice';
import passReducer from './slices/PassMasterSlice';
import KajButtonReducer from './slices/KajButtonSlice';
import permissionReducer from './slices/permissionSlice';

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

const userPersistedReducer = persistReducer(persistConfig, userReducer);
const orderPersistedReducer = persistReducer(persistConfig, orderReducer);
const defectMasterPersistedReducer = persistReducer(persistConfig, defectReducer);
const sewingInputPersistedReducer = persistReducer(persistConfig, sewingInputReducer);
const rejectMasterPersistedReducer = persistReducer(persistConfig, rejectReducer);
const passMasterPersistedReducer = persistReducer(persistConfig, passReducer);
const kajButtonPersistedReducer = persistReducer(persistConfig, KajButtonReducer);
const permissionPersistedReducer = persistReducer(persistConfig,permissionReducer);


// Create the Redux store
const store = configureStore({
  reducer: {
    user: userPersistedReducer,
    order: orderPersistedReducer,
    defectMaster: defectMasterPersistedReducer,
    sewingInput: sewingInputPersistedReducer,
    rejectMaster: rejectMasterPersistedReducer,
    passMaster: passMasterPersistedReducer,
    kajButton : kajButtonPersistedReducer,
    permissions: permissionPersistedReducer


  },


  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create the persistor
const persistor = persistStore(store);

// Export the store and persistor
export { store, persistor };
