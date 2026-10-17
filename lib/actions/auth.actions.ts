'use server';

import { getAuth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { headers } from "next/headers";
import { connectToDatabase } from "@/database/mongoose";

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

    // Save the onboarding answers against the real MongoDB user record.
    // Keep this separate from authentication so optional profile metadata
    // cannot turn a successfully-created account into a false failure.
    if (response) {
      try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (db) {
          await db.collection("user").updateOne(
            { email: email.toLowerCase() },
            {
              $set: {
                country,
                investmentGoals,
                riskTolerance,
                preferredIndustry,
                updatedAt: new Date(),
              },
            },
          );
        }
      } catch (profileError) {
        console.error("Account created, but onboarding profile could not be saved:", profileError);
      }

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
