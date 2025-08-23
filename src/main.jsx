// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import MainRouter from './routers/MainRouter';
// import { Provider } from 'react-redux';
// import { store, persistor } from './utils/store';
// import NotificationContainer from './utils/NotificationContainer';
// import { PersistGate } from 'redux-persist/integration/react';

// // Use createRoot to render your application
// const root = createRoot(document.getElementById('root'));

// root.render(
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <NotificationContainer />
//       <MainRouter />
//     </PersistGate>
//   </Provider>
// );


// src/main.jsx (or src/index.jsx)
import React from 'react';
import { createRoot } from 'react-dom/client';
import MainRouter from './routers/MainRouter';
import { Provider } from 'react-redux';
import { store, persistor } from './utils/store';
import NotificationContainer from './utils/NotificationContainer';
import { PersistGate } from 'redux-persist/integration/react';
import NetworkStatus from './utils/NetworkStatus';

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
      <NetworkStatus/>
      <NotificationContainer />
      <MainRouter />
  </Provider>
);
