"use client"
import React, { FC, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useUserData from "@/components/customHooks/useUserData";

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

  useEffect(() => {
    if (!isLoading && userData && userData.email) {
      fetchSubscriptionData();
    }
  }, [userData, isLoading]);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/subscription/status', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Make sure the token is stored and retrieved properly
        },
      });
      setSubscription(response.data);
    } catch (error: any) {
      console.error("Failed to fetch subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  const startTrial = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/subscription/startTrial', {}, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'), // Assuming you store the token in localStorage
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
    if (!subscription.trialStart) return 0;
    const trialEnd = new Date(subscription.trialStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const remaining = (trialEnd.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return Math.max(0, Math.ceil(remaining));
  }, [subscription.trialStart]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Manage Subscription</h1>
      <p>Manage your subscription here.</p>
      {error && <p className="text-red-500">{error}</p>}
      {!subscription.isSubscribed && !subscription.hasTrial && (
        <button onClick={handleStartTrial}>Start Free Trial</button>
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
  );
};

export default ManageSubscription;
