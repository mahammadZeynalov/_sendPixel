import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import * as s from "./RootStyles";
import { useEthersSigner } from "../hooks/useEtherSigner";

const Root = () => {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const signer = useEthersSigner();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleLoginClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (address) {
      setIsModalOpen(false);
    } else {
      navigate("/");
    }
  }, [address, navigate]);

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
