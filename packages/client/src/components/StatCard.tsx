import { Box, Typography } from "@mui/material";
import { AnimatedCounter } from "./AnimatedCounter";

export interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", width: 300 }}>
    <Box
      mx="auto"
      mb={1}
      width={70}
      height={70}
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="50%"
      bgcolor="#e6f4ea"
    >
      {icon}
    </Box>
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="subtitle2" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h4">
        <AnimatedCounter value={value} />
      </Typography>
    </Box>
  </Box>
);
