import Canvas from "./components/Canvas";
import styled from "styled-components";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Root from "./pages/Root";
import Canvases from "./pages/Canvases";

const CanvasContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

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
