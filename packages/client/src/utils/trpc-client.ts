import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "server";

export function getClient() {
  const token =
    typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

  return createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: "/api/",
        headers: {
          authorization: token ? `Bearer ${token}` : undefined,
        },
      }),
    ],
  });
}
