import { redirect } from "next/navigation";

// Legacy /post/[id] route — redirects to /discussion/[id]
// The old Reddit-style post URL is no longer used in Echo Phase 3.
export default function LegacyPostPage({ params }) {
  redirect(`/discussion/${params.id}`);
}
