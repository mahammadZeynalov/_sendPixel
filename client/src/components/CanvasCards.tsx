import { useEffect, useState } from "react";
import * as s from "./CanvasCardsStyles";
import { useGET } from "../hooks/useServer";
import { backendUrl } from "../config";
import { CircularLoader } from "./Loader";
import { FilterMode } from "../pages/Canvases";
import { useAccount } from "wagmi";
import { ICanvas } from "../models";

interface IProps {
  filterMode: FilterMode;
  selectedChainId: number;
}

const CanvasCards: React.FC<IProps> = ({ filterMode, selectedChainId }) => {
  const [canvases, setCanvases] = useState<ICanvas[]>([]);
  const { address } = useAccount();

  const { isLoading: isLoadingCanvases, data: dataCanvases } = useGET(
    ["canvases"],
    `${backendUrl}/canvases`,
    true,
    3000
  );

  useEffect(() => {
    if (dataCanvases) {
      setCanvases(dataCanvases);
    }
  }, [dataCanvases]);

  const displayedCanvases = canvases
    .filter((canvas) => {
      if (filterMode === FilterMode.OWNED) {
        return canvas.owner === address;
      } else if (filterMode === FilterMode.JOINED) {
        return canvas.pixels.some((pixel) => pixel.owner === address);
      } else if (filterMode === FilterMode.FUNDED) {
        return canvas.isFunded;
      } else {
        return canvas;
      }
    })
    .filter((canvas) => {
      return canvas.chainId === selectedChainId;
    });

  return (
    <div className="cards-container">
      {isLoadingCanvases ? (
        <CircularLoader />
      ) : !canvases?.length ? (
        <div>No canvases created yet</div>
      ) : (
        displayedCanvases.map(
          ({
            canvasId,
            name,
            owner,
            width,
            height,
            worldIdVerified,
            destination,
            chainId,
            creationTime,
            isFunded,
          }) => <div>Canvas</div>
        )
      )}
    </div>
  );
};

export default CanvasCards;
