"use client";

import { useState, useEffect } from "react";

interface UserInfo {
  name: string;
  email: string;
  avatar: string;
  bio: string;
}

interface Shade {
  id: number;
  shadeName: string;
  shadeIcon: string;
  shadeDescription: string;
  confidenceLevel: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [shades, setShades] = useState<Shade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/secondme/user/info").then((r) => r.json()),
      fetch("/api/secondme/user/shades").then((r) => r.json()),
    ])
      .then(([userResult, shadesResult]) => {
        if (userResult.code === 0) setUser(userResult.data);
        if (shadesResult.code === 0) setShades(shadesResult.data?.shades || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const confidenceColors: Record<string, string> = {
    VERY_HIGH: "bg-primary text-white",
    HIGH: "bg-primary-light/20 text-primary-dark",
    MEDIUM: "bg-accent-light/20 text-accent",
    LOW: "bg-gray-100 text-gray-600",
    VERY_LOW: "bg-gray-50 text-gray-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full ring-2 ring-primary/20"
          />
        ) : (
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-semibold">
            {user.name?.[0] || "?"}
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold">{user.name || "用户"}</h2>
          {user.email && (
            <p className="text-text-secondary text-sm">{user.email}</p>
          )}
        </div>
      </div>

      {user.bio && (
        <p className="text-text-secondary text-sm leading-relaxed">{user.bio}</p>
      )}

      {shades.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-3">兴趣标签</h3>
          <div className="flex flex-wrap gap-2">
            {shades.map((shade) => (
              <div
                key={shade.id}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
                  confidenceColors[shade.confidenceLevel] || confidenceColors.MEDIUM
                }`}
                title={shade.shadeDescription}
              >
                {shade.shadeIcon && (
                  <img src={shade.shadeIcon} alt="" className="w-4 h-4" />
                )}
                {shade.shadeName}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
