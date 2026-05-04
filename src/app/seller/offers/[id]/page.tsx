import { redirect } from "next/navigation";

export default function OfferDetailPage() {
  // Redirect to the main offers list where all offers are managed
  redirect("/seller/offers");
}
