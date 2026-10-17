'use server';

import { getAuth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async ({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}: SignUpFormData) => {
  try {
    const auth = await getAuth();
    const response = await auth.api.signUpEmail({
      body: { email, password, name: fullName },
    });

    // Account creation must not be reported as failed just because the
    // optional background-workflow service is unavailable.
    if (response) {
      try {
        await inngest.send({
          name: "app/user.created",
          data: {
            email,
            name: fullName,
            country,
            investmentGoals,
            riskTolerance,
            preferredIndustry,
          },
        });
      } catch (eventError) {
        console.error("Account created, but user.created workflow could not be queued:", eventError);
      }
    }

    return { success: true, data: response };
  } catch (e) {
    console.error("Sign up failed:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Sign up failed. Check your database and authentication settings.",
    };
  }
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  try {
    const auth = await getAuth();
    const response = await auth.api.signInEmail({ body: { email, password } });
    return { success: true, data: response };
  } catch (e) {
    console.error("Sign in failed:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Sign in failed. Check your details and database setup.",
    };
  }
};

export const signOut = async () => {
  try {
    const auth = await getAuth();
    await auth.api.signOut({ headers: await headers() });
  } catch (e) {
    console.error("Sign out failed:", e);
    return { success: false, error: "Sign out failed" };
  }
};
