import { useNavigate } from "react-router-dom";
import * as s from "./CanvasCardsStyles";
import { useAccount, useWriteContract } from "wagmi";
import { enqueueSnackbar } from "notistack";
import { canvasContractAbi } from "../common";
import { switchChain } from "@wagmi/core";
import { config } from "../config";
import { useEffect, useState } from "react";
import { add, differenceInSeconds } from "date-fns";
import WorldIdButton from "./WorldIdButton";
import worldIdIcon from "../assets/world-id-logo.svg";

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
  const navigate = useNavigate();
  const { address, chainId: accountChainId } = useAccount();
  const {
    data: claimTokenData,
    isPending: isClaimTokenLoading,
    writeContractAsync,
  } = useWriteContract();

  const [gradient, setGradient] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });

  const isOwner = address === owner;
  const isBeneficiary = address === destination;
  const isPlayable = !isExpired && !isFunded;

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

  const handleNavigate = () => {
    navigate(`/canvas/${canvasId}`);
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

  useEffect(() => {
    const initialGradient = getRandomGradient();
    setGradient(initialGradient);
  }, []);

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

  return (
    <s.Card>
      <div
        style={{
          width: "100%",
          height: "300px",
          overflow: "hidden",
          background: gradient,
        }}
      ></div>
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
      {worldIdVerified ? (
        <span
          className="badge rounded-pill bg-secondary"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={worldIdIcon}
            style={{ height: "15px", marginRight: "10px" }}
          />
          <span>World ID Verified</span>
        </span>
      ) : (
        isOwner && <WorldIdButton canvasId={canvasId}></WorldIdButton>
      )}
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
