"use client";
import { createContext, useState } from "react";

export const CampaignContext = createContext();

export const CampaignProvider = ({ children }) => {
  const [campaignState, setCampaignState] = useState({});

  return (
    <CampaignContext.Provider value={[campaignState, setCampaignState]}>
      {children}
    </CampaignContext.Provider>
  );
};
