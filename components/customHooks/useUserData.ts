"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

const SAFE_PATHS = new Set<string>(["/", "/Login", "/SignUp", "/ForgotPassword"]);

const useUserData = () => {
  const [userData, setUserData] = useState({} as any);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const pathname = (usePathname() || "/")
  const router = useRouter();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (!pathname) return;

    const fetchData = async () => {
      try {
        const res = await axios.get("/api/getUserData", { withCredentials: true });
        if (!mounted.current) return;
        setUserData(res.data);
        setIsLoading(false);
      } catch (err: any) {
        if (!mounted.current) return;

        const status = axios.isAxiosError(err) ? err.response?.status : undefined;

        if (status === 401) {
          if (!SAFE_PATHS.has(pathname)) {
            setError("Unauthorized");
            router.replace(`/Login?next=${encodeURIComponent(pathname)}`);
          } else {
            setError("Unauthorized access to restricted page");
          }
        } else {
          setError(err?.message || "An error occurred");
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pathname, router]);

  return { userData, isLoading, error };
};

export default useUserData;