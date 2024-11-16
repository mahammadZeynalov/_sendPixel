import React, { createContext, useContext, useState } from "react";
import { groupChatId } from "../config";

const initialContext = {
  user: null as any,
  isSubscribed: false,
  setUser: (user: any) => {},
  setIsSubscribed: (value: boolean) => {},
  isSubscribtionLoading: false,
  setIsSubscribtionLoading: (value: boolean) => {},
};

const PushNotificationsContext = createContext(initialContext);

export const PushNotificationsProvider = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribtionLoading, setIsSubscribtionLoading] = useState(false);

  return (
    <PushNotificationsContext.Provider
      value={{
        user,
        isSubscribed,
        setUser,
        setIsSubscribed,
        isSubscribtionLoading,
        setIsSubscribtionLoading,
      }}
    >
      {children}
    </PushNotificationsContext.Provider>
  );
};

export const usePushNotifications = () => {
  const context = useContext(PushNotificationsContext);
  if (!context) {
    throw new Error(
      "usePushNotifications must be used within a PushNotificationsProvider"
    );
  }
  return context;
};

export const notification = async (user, customMessage) => {
  await user.chat.send(groupChatId, {
    content: customMessage,
    type: "Text",
  });
};
