import PageLoader from "@/components/ui/page-loader";

export default function Loading() {
  return (
    <PageLoader
      title="Loading admin workspace"
      subtitle="Syncing sessions, users, and platform insights..."
    />
  );
}
