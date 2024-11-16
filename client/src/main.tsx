import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { PrivyProvider } from "@privy-io/react-auth";
import { config, privyAppID, privyConfig } from "./config";
import { PushNotificationsProvider } from "./utils/usePushNotifications.js";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrivyProvider appId={privyAppID} config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <SnackbarProvider>
            <PushNotificationsProvider>
              <App />
            </PushNotificationsProvider>
          </SnackbarProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  </StrictMode>
);
