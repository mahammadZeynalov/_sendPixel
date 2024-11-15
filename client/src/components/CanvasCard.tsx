import { useNavigate } from "react-router-dom";
import * as s from "./CanvasCardsStyles";
import { useAccount, useWriteContract } from "wagmi";
import { enqueueSnackbar } from "notistack";
import { canvasContractAbi } from "../common";
import { switchChain } from "@wagmi/core";
import { config } from "../config";
import { useEffect, useState } from "react";
import { add, differenceInSeconds } from "date-fns";

const CanvasCard = ({
  canvasId,
  name,
  owner,
  width,
  height,
  worldIdVerified,
  destination,
  chainId: canvasChainId,
  creationTime,
  isFunded,
}) => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const { address, chainId: accountChainId } = useAccount();
  const isOwner = address === owner;
  const isBeneficiary = address === destination;
  const [isExpired, setIsExpired] = useState(false);

  const handleNavigate = () => {
    // Navigate to the canvas route and pass the state
    navigate(`/canvas/${canvasId}`);
  };

  const {
    data: claimTokenData,
    isPending: isClaimTokenLoading,
    writeContractAsync,
  } = useWriteContract();

  // Handle canvas initialization (Step 1)
  const handleClaimTokens = () => {
    if (accountChainId === canvasChainId) {
      claim();
    } else {
      switchChain(config, { chainId: canvasChainId })
        .then((data) => {
          console.log("Switched chain: ", data);
        })
        .then(() => {
          claim();
        });
    }
  };

  const claim = () => {
    writeContractAsync({
      abi: canvasContractAbi,
      address: canvasId,
      functionName: "transferFunds",
      args: [],
      account: address,
    }).then(() => {
      enqueueSnackbar("Tokens has been claimed", {
        variant: "success",
      });
    });
  };

  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    const expirationDate = add(new Date(creationTime * 1000), { hours: 1 });

    const updateTimer = () => {
      const secondsLeft = differenceInSeconds(expirationDate, new Date());
      if (secondsLeft <= 0) {
        setIsExpired(true);
        setTimeLeft({ minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          minutes: Math.floor(secondsLeft / 60),
          seconds: secondsLeft % 60,
        });
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, [creationTime]);

  const isPlayable = !isExpired && !isFunded;

  const [gradient, setGradient] = useState("");

  const getRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
  };

  const getRandomGradient = () => {
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    const color3 = getRandomColor();
    return `linear-gradient(135deg, ${color1}, ${color2}, ${color3})`;
  };

  useEffect(() => {
    const initialGradient = getRandomGradient();
    setGradient(initialGradient);
  }, []);

  return (
    <s.Card>
      {/* Other card code */}
      <div
        style={{
          width: "100%",
          height: "300px",
          overflow: "hidden",
          background: gradient,
        }}
      >
        {/* <img
          src="https://via.placeholder.com/150"
          alt="Canvas Placeholder"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        /> */}
      </div>
      <s.NameIdEditWrapper>
        <s.NameIdWrapper>
          <s.Name>{name}</s.Name>
          <s.Id>{canvasId}</s.Id>
        </s.NameIdWrapper>
      </s.NameIdEditWrapper>
      <s.PropWrapper>
        <s.PropTitle>Deployer</s.PropTitle>
        <s.Id>{owner}</s.Id>
      </s.PropWrapper>
      <s.PropWrapper>
        <s.PropTitle>Resolution</s.PropTitle>
        <s.PropValue>
          {width}x{height}
        </s.PropValue>
      </s.PropWrapper>

      <s.PropsWrapper>
        {isExpired ? (
          <s.PropWrapper>
            <s.PropTitle>Expired</s.PropTitle>
          </s.PropWrapper>
        ) : (
          <s.PropWrapper>
            <s.PropTitle>Expires in:</s.PropTitle>
            <s.PropValue>
              {timeLeft.minutes}m {timeLeft.seconds}s
            </s.PropValue>
          </s.PropWrapper>
        )}
      </s.PropsWrapper>
      {isBeneficiary && (
        <button className="btn btn-secondary" onClick={handleClaimTokens}>
          Claim tokens
        </button>
      )}
      {isPlayable && <s.EnterBtn onClick={handleNavigate}>Enter</s.EnterBtn>}
    </s.Card>
  );
};

export default CanvasCard;
