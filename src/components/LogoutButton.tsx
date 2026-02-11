"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useUser();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      className="btn-secondary !py-1.5 !px-4 text-xs"
    >
      退出登录
    </button>
  );
}
