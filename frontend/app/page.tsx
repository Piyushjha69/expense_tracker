"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "../src/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      router.replace("/expense");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return <div>Loading...</div>;
}
