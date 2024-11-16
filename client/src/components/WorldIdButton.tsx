import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
} from "@worldcoin/idkit";
import { backendUrl } from "../config";

const worldAppId = import.meta.env.VITE_PUBLIC_WORLD_APP_ID as `app_${string}`;
const worldAction: string = import.meta.env.VITE_PUBLIC_WORLD_ACTION;

export type VerifyReply = {
  success: boolean;
  code?: string;
  attribute?: string | null;
  detail?: string;
};

const WorldIdButton = ({ canvasId }) => {
  const onSuccess = async (result: ISuccessResult) => {
    console.log("result: ", result);
  };

  const handleProof = async (result: ISuccessResult) => {
    console.log(
      "Proof received from IDKit, sending to backend:\n",
      JSON.stringify(result)
    );
    const response = await fetch(`${backendUrl}/world-id-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ proof: result, canvasId }),
    });
    const data: VerifyReply = await response.json();
    if (data.success) {
      console.log("Successful response from backend:\n", JSON.stringify(data));
    } else {
      throw new Error(`Verification failed: ${data.detail}`);
    }
  };

  return (
    <IDKitWidget
      app_id={worldAppId}
      action={worldAction}
      onSuccess={onSuccess}
      handleVerify={handleProof}
      verification_level={VerificationLevel.Orb}
    >
      {({ open }) => (
        <button className="btn btn-secondary" onClick={open}>
          Verify with World ID
        </button>
      )}
    </IDKitWidget>
  );
};

export default WorldIdButton;
