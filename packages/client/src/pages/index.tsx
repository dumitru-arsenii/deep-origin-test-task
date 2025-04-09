import { Layout } from "../components/Layout";
import { ShortLinkForm } from "@/components/ShortLinkForm";
import { Stats } from "@/components/Stats";
import { LinksTable } from "@/components/LinksTable";
import { motion } from "framer-motion";
import { Box, Paper, Typography } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useUser } from "@/contexts/userContext";
import { StatsProvider } from "@/contexts/statsContext";

export default function Home() {
  const { user } = useUser();

  const childVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.8 },
    }),
  };

  return (
    <Layout>
      <StatsProvider>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          <motion.div custom={0} variants={childVariants}>
            <ShortLinkForm />
          </motion.div>
          <motion.div custom={1} variants={childVariants}>
            <Stats />
          </motion.div>
          {user ? (
            <motion.div custom={2} variants={childVariants}>
              <LinksTable />
            </motion.div>
          ) : (
            <motion.div custom={2} variants={childVariants}>
              <Paper
                elevation={3}
                sx={{
                  textAlign: "center",
                  padding: 5,
                  borderRadius: 2,
                  mt: 8,
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ marginBottom: "1rem", color: "#333" }}
                >
                  Welcome to Your Dashboard
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ marginBottom: "1.5rem", color: "#555" }}
                >
                  Please sign in to access your personalized dashboard and
                  manage your links.
                </Typography>
                <Typography variant="body2" sx={{ color: "#777" }}>
                  Note: Unauthorized links will expire after 48 hours.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{ width: "45%", p: 4, boxSizing: "border-box" }}>
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
                      <BarChartIcon fontSize="large" />
                    </Box>
                    <Typography variant="h6" component="div">
                      Detailed Metrics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View detailed metrics of your links.
                    </Typography>
                  </Box>
                  <Box sx={{ width: "45%", p: 4, boxSizing: "border-box" }}>
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
                      <EditIcon fontSize="large" />
                    </Box>
                    <Typography variant="h6" component="div">
                      Custom Short Codes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create custom short codes for your links.
                    </Typography>
                  </Box>
                  <Box sx={{ width: "45%", p: 4, boxSizing: "border-box" }}>
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
                      <LinkIcon fontSize="large" />
                    </Box>
                    <Typography variant="h6" component="div">
                      Manage Links
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage and organize your links effectively.
                    </Typography>
                  </Box>
                  <Box sx={{ width: "45%", p: 4, boxSizing: "border-box" }}>
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
                      <TrendingUpIcon fontSize="large" />
                    </Box>
                    <Typography variant="h6" component="div">
                      Track Performance
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Track the performance of your links over time.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          )}
        </motion.div>
      </StatsProvider>
    </Layout>
  );
}
