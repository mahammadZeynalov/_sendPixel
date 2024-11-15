import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { SketchPicker } from "react-color";
import { PixelItem } from "./Canvas";
import { Tooltip } from "react-tooltip";
import { supportedChains } from "../config";
import { useAccount } from "wagmi";

interface ColorProps {
  $color: {
    r: number;
    g: number;
    b: number;
  };
}

const PixelContainer = styled.div<ColorProps>`
  background-color: rgb(
    ${({ $color }) => $color.r},
    ${({ $color }) => $color.g},
    ${({ $color }) => $color.b}
  );
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const PaletteContainer = styled.div`
  position: absolute;
  z-index: 100;
  top: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: darkgray;
  padding: 10px;
  border-radius: 5px;
`;

const ColorConfirmerBtn = styled.div`
  background-color: #f0f0f0;
  border: none;
  padding: 10px;
  width: auto;
  border-radius: 5px;
  cursor: pointer;
`;

interface IProps {
  pixelData: PixelItem;
  onConstructEth: (
    x: number,
    y: number,
    r: number,
    g: number,
    b: number
  ) => void;
  activePixelId: number | null;
  setActivePixelId: Dispatch<SetStateAction<number | null>>;
}

const Pixel: React.FC<IProps> = ({
  pixelData,
  onConstructEth,
  activePixelId,
  setActivePixelId,
}) => {
  const [color, setColor] = useState(pixelData.color);

  const handleChange = (newColor) => {
    setColor(newColor.rgb);
  };

  const handlePropagation = (e) => e.stopPropagation();
  const handleConfirm = () => {
    console.log("Confirming color change...", color);
    onConstructEth(pixelData.x, pixelData.y, color.r, color.g, color.b);
  };

  const { chainId: accountChainId } = useAccount();
  const chain = supportedChains.find((c) => c.id === accountChainId);
  const explorerUrl = chain?.blockExplorers?.default?.blockscoutUrl || "";
  const fullUrl = `${explorerUrl}address/${pixelData.owner}`;

  return (
    <>
      <PixelContainer
        $color={color}
        style={{
          backgroundColor: activePixelId === pixelData._id ? "grey" : "white",
        }}
        onClick={() => setActivePixelId(pixelData._id!)}
        data-tooltip-id={`tooltip-${pixelData._id}`} // Add tooltip ID
        data-tooltip-html={
          pixelData.owner
            ? `<a href=${fullUrl} target="_blank">Last owner: ${pixelData.owner}</a>`
            : "Last owner: N/A"
        }
      >
        {activePixelId === pixelData._id && (
          <PaletteContainer onClick={handlePropagation}>
            <SketchPicker color={color} onChange={handleChange} />
            <button className="btn btn-primary" onClick={handleConfirm}>
              Confirm
            </button>
          </PaletteContainer>
        )}
      </PixelContainer>

      <Tooltip
        clickable
        id={`tooltip-${pixelData._id}`}
        style={{
          backgroundColor: "#333333", // Dark gray background
          color: "#ffffff", // White text
          padding: "8px", // Extra padding
          borderRadius: "8px", // Rounded corners
          fontSize: "0.9rem", // Slightly smaller font
        }}
      />
    </>
  );
};

export default Pixel;
