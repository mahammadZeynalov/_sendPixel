import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import * as s from "./RootStyles";
import { useEthersSigner } from "../hooks/useEtherSigner";
import {
  notification,
  usePushNotifications,
} from "../utils/usePushNotifications";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";
import { groupChatId } from "../config";

const Root = () => {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const signer = useEthersSigner();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isSubscribed, setUser, setIsSubscribed } = usePushNotifications();
  const handleLoginClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (address) {
      setIsModalOpen(false);
    } else {
      navigate("/");
    }
  }, [address, navigate]);

  const handleSubscribe = async () => {
    const user = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.STAGING,
    });
    await user.chat.group.join(groupChatId);
    setUser(user);
    setIsSubscribed(true);
    const stream = await user.initStream([CONSTANTS.STREAM.CHAT]);

    stream.on(CONSTANTS.STREAM.CHAT, (message) => {
      withReactContent(Swal).fire({
        toast: true,
        icon: "success",
        title: `<div style="white-space: normal; word-wrap: break-word;">${message.message.content}</div>`, // Позволяет перенести текст
        animation: false,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
        width: 500,
      });
    });
    stream.connect();
    notification(user, `${address} has joined the chat.`);
  };

  return (
    <div className="container">
      <div className="nav-bar-container mb-4">
        <div className="nav-bar-container-logo">
          <a className="nav-bar-container-logo-link" href="/">
            LOGO
            {/* <img src={logoSideText} height="65px" alt="Logo" /> */}
          </a>
        </div>
        <div className="nav-bar-container-info">
          <div>
            {address ? (
              <div
                style={{ display: "flex", gap: "20px", alignItems: "center" }}
              >
                <div>{address}</div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    disconnect();
                  }}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <s.ConnectWalletBtnWrapper>
                <button className="btn btn-primary" onClick={handleLoginClick}>
                  Login
                </button>
              </s.ConnectWalletBtnWrapper>
            )}
          </div>
        </div>
      </div>

      <s.OutletContainer>
        <Outlet context={{ address }} />
      </s.OutletContainer>

      <s.FooterLinksContainer>
        <a
          href="https://t.me/winlabs_az"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Blog
        </a>
      </s.FooterLinksContainer>

      {isModalOpen && (
        <s.ModalOverlay>
          <s.ModalContainer>
            <h2>Login</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "100%",
              }}
            >
              {connectors.map((connector) => (
                <button
                  className="btn btn-primary"
                  key={connector.id}
                  onClick={() => connect({ connector })}
                >
                  {connector.name}
                </button>
              ))}
              <button
                className="btn btn-primary"
                onClick={() => console.log("login")}
              >
                Privy
              </button>
            </div>
            <button className="btn btn-primary" onClick={closeModal}>
              Close
            </button>
          </s.ModalContainer>
        </s.ModalOverlay>
      )}
    </div>
  );
};

export default Root;
