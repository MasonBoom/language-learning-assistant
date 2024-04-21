"use client"
import React, { FC, useState, useCallback } from 'react';
import axios from 'axios';
import useUserData from "@/components/customHooks/useUserData";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface SubscriptionState {
  hasTrial: boolean;
  trialStart: Date | null;
  isSubscribed: boolean;
  trialEnd?: Date | null;
}

const ManageSubscription: FC = () => {
  const { userData, isLoading, error } = useUserData();
  const [subscription, setSubscription] = useState<SubscriptionState>({
    hasTrial: false,
    trialStart: null,
    isSubscribed: false,
  });
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const startTrial = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/subscription/startTrial', {}, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'), 
        }
      });
      if (response.data.success) {
        setSubscription(prevState => ({
          ...prevState,
          hasTrial: true,
          trialStart: new Date(response.data.trialEnd - 7 * 24 * 60 * 60 * 1000),
          isSubscribed: false,
        }));
      }
    } catch (error: any) {
      console.error("Failed to start trial:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/subscription/cancel');
      if (response.data.success) {
        setSubscription({
          ...subscription,
          isSubscribed: false,
        });
      }
    } catch (error: any) {
      console.error("Failed to cancel subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrial = useCallback(() => {
    startTrial();
  }, []);

  const handleCancelSubscription = useCallback(() => {
    cancelSubscription();
  }, []);

  const calculateRemainingTrialDays = useCallback(() => {
    if (!userData || !userData.subscription?.trialStart) return 0;
    const trialEnd = new Date(new Date(userData.subscription.trialStart).getTime() + 7 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const remaining = (trialEnd.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return Math.max(0, Math.ceil(remaining));
  }, [userData]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <PayPalScriptProvider options={{ clientId: "YOUR_CLIENT_ID" }}>
    <div>
      <h1>Manage Subscription</h1>
      <p>Manage your subscription here.</p>
      {error && <p className="text-red-500">{error}</p>}
      {!subscription.isSubscribed && !subscription.hasTrial && (
        <PayPalButtons 
          createSubscription={(data, actions) => {
            return actions.subscription.create({
              plan_id: "YOUR_PLAN_ID",
            });
          }}
          onApprove={(data, actions) => {
            return new Promise<void>((resolve, reject) => {
              // Perform your operations here. For example:
              actions?.subscription?.get().then((details) => {-
                console.log("Subscription details:", details);
                // Update state or perform further actions after subscription approval
                resolve();
              }).catch(error => {
                console.error("Error during subscription get:", error);
                reject();
              });
            });
          }}
        />
      )}
      {subscription.hasTrial && (
        <p>Trial remaining days: {calculateRemainingTrialDays()}</p>
      )}
      {subscription.isSubscribed ? (
        <button onClick={handleCancelSubscription}>Cancel Subscription</button>
      ) : (
        <p>You are not currently subscribed.</p>
      )}
    </div>
    </PayPalScriptProvider>
  );
};

export default ManageSubscription;
