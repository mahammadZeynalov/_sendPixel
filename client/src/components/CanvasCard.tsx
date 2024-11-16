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

  return (
    <s.Card>
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
      {isPlayable && (
        <button className="btn btn-primary" onClick={handleNavigate}>
          Enter
        </button>
      )}
    </s.Card>
  );
};

export default CanvasCard;
