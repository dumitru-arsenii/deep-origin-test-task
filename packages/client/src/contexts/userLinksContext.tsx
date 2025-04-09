import { getClient } from "@/utils/trpc-client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface UserLinksContextValue {
  links: any[]; // Replace `any` with the appropriate type for your links
  loading: boolean;
  refetch: () => void;
}

const UserLinksContext = createContext<UserLinksContextValue | undefined>(
  undefined
);

export const UserLinksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [links, setLinks] = useState<any[]>([]); // Replace `any` with the appropriate type
  const [loading, setLoading] = useState<boolean>(false);
  const fetch = useMemo(
    () => () => {
      setLoading(true);
      getClient()
        .links.getAllByUser.query()
        .then((fetchedLinks) => {
          setLinks(fetchedLinks);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    },
    []
  );

  return (
    <UserLinksContext.Provider value={{ links, loading, refetch: fetch }}>
      {children}
    </UserLinksContext.Provider>
  );
};

export const useUserLinks = (): UserLinksContextValue => {
  const context = useContext(UserLinksContext);

  useEffect(() => {
    context!.refetch();
  }, []);

  if (!context) {
    throw new Error("useUserLinks must be used within a UserLinksProvider");
  }
  return context;
};
