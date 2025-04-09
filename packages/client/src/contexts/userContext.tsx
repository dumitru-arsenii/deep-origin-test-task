import { getClient } from "@/utils/trpc-client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { User } from "server/src/domains/user/user.repository";

interface UserContextValue {
  user: User | undefined;
  loading: boolean;
  refetch: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(false);
  const fetch = useMemo(
    () => () => {
      setLoading(true);
      getClient()
        .users.me.query()
        .then((user) => {
          setUser(user);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          localStorage.removeItem("token");
        });
    },
    []
  );

  return (
    <UserContext.Provider value={{ user, loading, refetch: fetch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);

  useEffect(() => {
    context!.refetch();
  }, []);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
