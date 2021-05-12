import React, { Suspense } from "react";
import { Provider } from "react-redux";
import ReduxToastr from "react-redux-toastr";
import store from "./redux/store/index";
import Routes from "./routes/Routes";


const App = () => (
  
  <Suspense fallback={null}>
    <Provider store={store}>
      <Routes />
      <ReduxToastr
        timeOut={5000}
        newestOnTop={true}
        position="top-right"
        transitionIn="fadeIn"
        transitionOut="fadeOut"
        progressBar
        closeOnToastrClick
      />
    </Provider>
  </Suspense>
);

export default App;
