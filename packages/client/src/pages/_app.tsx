import { UserProvider } from "@/contexts/userContext";
import { UserLinksProvider } from "@/contexts/userLinksContext";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <UserLinksProvider>
        <Component {...pageProps} />;
      </UserLinksProvider>
    </UserProvider>
  );
}
