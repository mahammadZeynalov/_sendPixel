import Canvas from "./components/Canvas";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Root from "./pages/Root";
import Canvases from "./pages/Canvases";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        //@ts-ignore
        index: "true",
        element: <Canvases />,
      },
      {
        path: "canvas/:canvasId",
        element: <Canvas />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
