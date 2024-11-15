import { RouterProvider, createBrowserRouter } from "react-router-dom";
import styled from "styled-components";

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
    element: <div></div>,
    children: [
      {
        //@ts-ignore
        index: "true",
        element: <div></div>,
      },
      {
        path: "canvas/:canvasId",
        element: <div></div>,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
