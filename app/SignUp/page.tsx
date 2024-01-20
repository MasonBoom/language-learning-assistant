"use client"
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();

    // Check if the URL has a code parameter returned by Google
    // if (router.query.code) { 
    //   // Exchange the code for tokens and handle user signup
    //   // Typically involves a call to your backend server
    // }
  

  return (
    <main>
      <span>Sign up</span>
    </main>
  );
}

// TODO: look into importing the actions.ts functions below

// serverSideProps

// checkUserAuthentication
