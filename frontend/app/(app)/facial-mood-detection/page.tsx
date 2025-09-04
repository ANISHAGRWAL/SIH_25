// app/(app)/facial-mood-detection/page.tsx
"use client";

import dynamic from "next/dynamic";

// Load your component **only on the client**
const FacialDetection = dynamic(() => import("@/components/FacialDetection"), {
  ssr: false,
});

export default function Page() {
  return <FacialDetection />;
}
