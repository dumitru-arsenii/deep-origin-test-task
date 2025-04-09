import React, { useEffect, useState } from "react";
import { getClient } from "@/utils/trpc-client";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Divider,
  Paper,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import ClickIcon from "@mui/icons-material/TouchApp";
import ActiveIcon from "@mui/icons-material/DoneAll";
import LinkIcon from "@mui/icons-material/Link";
import { StatCard } from "./StatCard";
import { useUser } from "@/contexts/userContext";
import { useStats } from "@/contexts/statsContext";

export const Stats: React.FC = () => {
  const { loading: userLoading } = useUser();
  const { stats, loading } = useStats();

  if ((userLoading || loading) && !stats) {
    return (
      <Card>
        <CardContent>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1">Failed to load statistics.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Paper
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "stretch",
          p: 4,
          backgroundColor: "#fff",
          borderRadius: 4,
          mt: 8,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <StatCard
          icon={<LinkIcon fontSize="large" />}
          title="Total Links"
          value={+stats.totalLinks}
        />
        <Divider orientation="vertical" sx={{ height: "auto", ml: 1, mr: 3 }} />
        <StatCard
          icon={<ClickIcon fontSize="large" />}
          title="Total Clicks"
          value={+stats.totalClicks}
        />
        <Divider orientation="vertical" sx={{ height: "auto", ml: 1, mr: 3 }} />
        <StatCard
          icon={<GroupIcon fontSize="large" />}
          title="Unique Visitors"
          value={+stats.uniqueVisitors}
        />
        <Divider orientation="vertical" sx={{ height: "auto", ml: 1, mr: 3 }} />
        <StatCard
          icon={<ActiveIcon fontSize="large" />}
          title="Active Links"
          value={+stats.activeLinks}
        />
      </Paper>
    </>
  );
};
