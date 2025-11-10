import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

const useUserData = () => {
  const [userData, setUserData] = useState({} as any);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/getUserData");
        setUserData(response.data);
        setIsLoading(false);
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          const nonRedirectPaths = [
            "/",
            "/Login",
            "/SignUp",
            "/ForgotPassword",
          ];

          if (!nonRedirectPaths.includes(pathname)) {
            setError("Unauthorized");
            router.push("/Login");
          } else {
            setError("Unauthorized access to restricted page");
          }
        } else {
          setError(error.message || "An error occurred");
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pathname]); 

  return { userData, isLoading, error };
};

export default useUserData;
