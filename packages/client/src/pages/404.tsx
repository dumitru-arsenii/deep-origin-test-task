import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";
import { motion } from "motion/react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { getClient } from "@/utils/trpc-client";

export default function Custom404() {
  const client = getClient();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [link, setLink] = useState<Awaited<
    ReturnType<typeof client.links.resolve.query>
  > | null>(null);
  const [showSpinner, setShowSpinner] = useState(true);

  const shortCode =
    typeof window !== "undefined"
      ? window.location.pathname.split("/").pop()
      : "";

  useEffect(() => {
    if (!shortCode) return;

    setLoading(true);
    client.links.resolve
      .query({ shortCode })
      .then((link) => {
        setLink(link);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setNotFound(true);
      });
  }, [shortCode]);

  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => setShowSpinner(false), 1000); // Ensure spinner is shown for at least 1 second
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  useEffect(() => {
    if (!link) return;

    const parser = new UAParser();
    const result = parser.getResult();

    const isDesktop =
      !/Mobi|Android|Tablet|iPad|iPhone/i.test(navigator.userAgent) &&
      window.innerWidth > 1024;

    getClient()
      .stats.recordAccess.mutate({
        uniqueUser: navigator.userAgent,
        device: isDesktop
          ? "desktop"
          : result.device.type === "mobile" || result.device.type === "tablet"
            ? result.device.type
            : "other",
        os: result.os.name || "Unknown",
        linkId: link.id,
      })
      .catch((err) => console.error("Failed to record stats:", err));
  }, [link]);

  return (
    <>
      <style>
        {`
          .container {
              display: flex;
              flex-direction: column;
              height: 100vh;
              justify-content: center;
              align-items: center;
              padding: 40px;
              border-radius: 8px;
          }

          .spinner {
              width: 150px;
              height: 150px;
              border-radius: 50%;
              border: 8px solid #22222210;
              border-top-color: #ff0088;
              will-change: transform;
          }
        `}
      </style>
      {showSpinner ? (
        <div className="container">
          <motion.div
            key="spinner"
            className="spinner"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      ) : link ? (
        <div className="container">
          <Card sx={{ minWidth: 500, mb: 3, p: 3 }}>
            <CardContent>
              <Typography
                gutterBottom
                sx={{ color: "text.secondary", fontSize: 14 }}
              >
                {link.originalUrl.length > 50
                  ? link.originalUrl.substring(0, 50) + "..."
                  : link.originalUrl}
              </Typography>
              <Typography variant="h4" component="div">
                {`${window.location.origin}/${link.shortCode}`}
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  mb: 1.5,
                  mt: 1,
                }}
              >
                {new Date(link.createdAt).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 500, mb: 3, p: 3 }}>
            <CardActions sx={{ justifyContent: "space-between" }}>
              <Button
                size="large"
                variant="contained"
                color="warning"
                onClick={() => (window.location.href = link.originalUrl)}
              >
                Access Link
              </Button>
              <Button
                size="large"
                variant="outlined"
                onClick={() => (window.location.href = "/")}
              >
                Go Home
              </Button>
            </CardActions>
          </Card>
          {(link.userName || link.userEmail) && (
            <Card sx={{ minWidth: 500, mb: 3, p: 3 }}>
              <CardContent>
                <Typography
                  gutterBottom
                  sx={{ color: "text.secondary", fontSize: 14 }}
                >
                  User Details
                </Typography>
                {link.userName && (
                  <Typography variant="h4" component="div">
                    {link.userName}
                  </Typography>
                )}
                {link.userEmail && (
                  <Typography
                    sx={{
                      color: "text.secondary",
                      mb: 1.5,
                      mt: 1,
                    }}
                  >
                    {link.userEmail}
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ) : notFound ? (
        <div className="container">
          <motion.div
            key="not-found"
            initial={{
              opacity: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            animate={{ opacity: 1 }}
            transition={{ duration: 5, ease: "ease", repeat: Infinity }}
          >
            <Typography
              variant="h4"
              component="p"
              sx={{ mb: 2, fontWeight: "bold" }}
            >
              We're sorry, but the link you are looking for was not found.
            </Typography>
            <Typography variant="body1" component="p" sx={{ mb: 2 }}>
              It seems the link you tried to access does not exist or may have
              been removed. Please check the URL or return to the dashboard to
              explore other options.
            </Typography>
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={() => (window.location.href = "/")}
            >
              Go to Dashboard
            </Button>
          </motion.div>
        </div>
      ) : (
        <div className="container">
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Typography variant="h5" component="p" sx={{ mb: 2 }}>
              Loading...
            </Typography>
          </motion.div>
        </div>
      )}
    </>
  );
}
