"use client";
import { createContext, useState, useEffect } from "react";

export const CampaignContext = createContext();

export const CampaignProvider = ({ children }) => {
  const [campaignState, setCampaignState] = useState({});

  useEffect(() => {
    const oldCampaignState = sessionStorage.getItem("campaign");
    if (oldCampaignState) {
      console.log("Last campaign found, resetting context to last state");
      setCampaignState(JSON.parse(oldCampaignState));
    }
  }, []);

  useEffect(() => {
    console.log("campaign updated, save to session Storage");
    sessionStorage.setItem("campaign", JSON.stringify(campaignState));
  }, [campaignState]);

  return (
    <CampaignContext.Provider value={[campaignState, setCampaignState]}>
      {children}
    </CampaignContext.Provider>
  );
};
