import './App.css'
import {Route} from "lucide-react";
import ErrorPage from "./pages/error/ErrorPage.tsx";

function App() {

  return (
      <Route>
          <ErrorPage />
      </Route>
  )
}

export default App;
