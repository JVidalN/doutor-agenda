import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export const WithAuthentication = async ({
  children,
  mustHavePlan = true,
  mustHaveClinic = true,
}: {
  children: React.ReactNode;
  mustHavePlan?: boolean;
  mustHaveClinic?: boolean;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (mustHavePlan && !session.user.plan) {
    redirect("/new-subscription");
  }

  if (mustHaveClinic && !session.user.clinic) {
    redirect("/clinic-form");
  }

  return children;
};
