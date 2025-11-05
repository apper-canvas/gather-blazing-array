import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { useEffect } from "react";


function App() {
  return <RouterProvider router={router} />;
}

export default App;