import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";
import Theme from "components/template/Theme";
import Layout from "components/layout";
import history from "./history";
import "./locales";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'assets/styles/components/_mui-date-picker.css';

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter history={history}>
          <Theme>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Layout />
            </LocalizationProvider>
          </Theme>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
