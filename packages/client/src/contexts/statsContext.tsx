import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getClient } from "@/utils/trpc-client";
import { useUser } from "@/contexts/userContext";

interface StatsData {
  totalLinks: number;
  totalClicks: number;
  uniqueVisitors: number;
  activeLinks: number;
}

interface StatsContextValue {
  stats: StatsData | null;
  loading: boolean;
  refetch: () => void;
}

const StatsContext = createContext<StatsContextValue | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetch = useMemo(
    () => async () => {
      setLoading(true);
      try {
        if (user) {
          const userMetrics =
            await getClient().metrics.getTotalMetricsByUser.query({
              userId: user.id,
            });
          setStats({
            totalLinks: userMetrics.totalLinks,
            totalClicks: userMetrics.totalClicks,
            uniqueVisitors: userMetrics.uniqueVisitors,
            activeLinks: userMetrics.activeLinks,
          });
        } else {
          const commonMetrics =
            await getClient().metrics.getTotalMetrics.query();
          setStats({
            totalLinks: commonMetrics.totalLinks,
            totalClicks: commonMetrics.totalClicks,
            uniqueVisitors: commonMetrics.uniqueVisitors,
            activeLinks: commonMetrics.activeLinks,
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return (
    <StatsContext.Provider value={{ stats, loading, refetch: fetch }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = (): StatsContextValue => {
  const context = useContext(StatsContext);

  useEffect(() => {
    context!.refetch();
  }, []);

  if (!context) {
    throw new Error("useStats must be used within a StatsProvider");
  }
  return context;
};
