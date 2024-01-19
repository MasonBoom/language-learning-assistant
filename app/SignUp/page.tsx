"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type SignUpProps = {
  isUserLoggedIn: boolean;
};

async function handleGoogleSignIn() {
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=openid%20email%20profile`;
}

export default function SignUp( { isUserLoggedIn }: SignUpProps ) {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is already logged in
    if (isUserLoggedIn) {
      router.push('/dashboard'); // Redirect to dashboard if already logged in
    }

    // Check if the URL has a code parameter returned by Google
    // if (router.query.code) { 
    //   // Exchange the code for tokens and handle user signup
    //   // Typically involves a call to your backend server
    // }
  }, [router, isUserLoggedIn]);

  return (
    <main>
      <span>Sign up</span>
      <button onClick={handleGoogleSignIn}>Sign Up with Google</button>
    </main>
  );
}

// TODO: look into importing the actions.ts functions below

// serverSideProps

// checkUserAuthentication
