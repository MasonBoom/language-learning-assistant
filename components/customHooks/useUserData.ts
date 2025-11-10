import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

const useUserData = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/getUserData");
        setUserData(response.data);
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          const nonRedirectPaths = ["/", "/Login", "/SignUp", "/ForgotPassword"];

          if (!nonRedirectPaths.includes(pathname)) {
            router.push("/Login");
          } else {
            setError("Unauthorized: please log in to access your account.");
          }
        } else {
          setError(error.message || "An error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pathname]);

  return { userData, isLoading, error };
};

export default useUserData;
