"use client";

import { Spinner } from "@/components/ui/spinner";

type PageLoaderProps = {
  title?: string;
  subtitle?: string;
  compact?: boolean;
};

export default function PageLoader({
  title = "Preparing your wellness space",
  subtitle = "Loading secure and personalized experience...",
  compact = false,
}: PageLoaderProps) {
  return (
    <div
      className={`w-full ${
        compact ? "py-14" : "min-h-[60vh]"
      } flex items-center justify-center px-4`}
    >
      <div className="mental-shell page-fade-in max-w-md w-full p-8 text-center">
        <div className="mx-auto mb-4 w-fit soft-float">
          <Spinner variant="modern-ring" size={56} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold shimmer-text">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}
