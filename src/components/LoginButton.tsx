"use client";

export default function LoginButton() {
  return (
    <a
      href="/api/auth/login"
      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-medium text-base
                 gradient-primary shadow-lg shadow-primary/25
                 hover:shadow-xl hover:shadow-primary/30
                 transition-shadow duration-200"
    >
      开始搭灵
    </a>
  );
}
