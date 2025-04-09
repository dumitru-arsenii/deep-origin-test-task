import { copyToClipboard } from "@/utils/copyToClipboard";
import { getClient } from "@/utils/trpc-client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  FormControl,
  InputAdornment,
  Input,
  InputLabel,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import AvalableIcon from "@mui/icons-material/CheckCircle";
import CheckIcon from "@mui/icons-material/PendingRounded";
import { useUser } from "@/contexts/userContext";
import { useUserLinks } from "@/contexts/userLinksContext";
import { useStats } from "@/contexts/statsContext";

export const ShortLinkForm: React.FC = () => {
  const { user } = useUser();
  const { refetch: refetchUserLinks } = useUserLinks();
  const { refetch: refetchStats } = useStats();
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const isValidUrl = useMemo(() => {
    try {
      if (originalUrl) {
        new URL(originalUrl);
      }
      return true;
    } catch (e) {
      return false;
    }
  }, [originalUrl]);

  const checkAvailability = (code: string) => {
    if (code.length > 24) {
      setError("Shortcode must be 24 characters or less.");
      setIsAvailable(false);
      return;
    }

    setError("");
    setIsChecking(true);
    const client = getClient();

    client.links.checkUniqueShortCode
      .query({ shortCode: code })
      .then((response) => {
        setIsAvailable(!response.exists);
        if (response.exists) {
          setError("Shortcode is already taken.");
        }
      })
      .catch((err) => {
        console.error("Error checking shortcode availability:", err);
        setError("Failed to check availability.");
      })
      .finally(() => {
        setIsChecking(false);
      });
  };

  useEffect(() => {
    setIsAvailable(false);
    setError("");

    if (shortCode) {
      setIsChecking(true);
      const timer = setTimeout(() => {
        checkAvailability(shortCode);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setIsChecking(false);
    }
  }, [shortCode]);

  const handleCreateShortLink = useMemo(
    () => () => {
      if (shortCode && !isAvailable) {
        setError("Please ensure the shortcode is available before creating.");
        return;
      }

      const client = getClient();

      client.links.create
        .mutate({
          originalUrl,
          shortCode: shortCode || undefined,
          expireDate: user
            ? undefined
            : new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        })
        .then((response) => {
          setShortLink(`${window.location.origin}/${response.shortCode}`);
          refetchUserLinks();
          refetchStats();
          setError("");
          setShortCode("");
          setOriginalUrl("");
        })
        .catch((err) => {
          console.error("Error creating short link:", err);
          setError("Failed to create short link.");
        });
    },
    [user, originalUrl, shortCode, isAvailable]
  );

  return (
    <Paper sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 10 }} elevation={0}>
      <Typography variant="h4" gutterBottom>
        Create a Short Link
      </Typography>
      <TextField
        fullWidth
        label="Enter URL"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        margin="normal"
        variant="standard"
        error={!isValidUrl}
      />
      {user && (
        <>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ marginLeft: "-15px" }}>
              Enter Custom Shortcode (Optional)
            </InputLabel>
            <Input
              fullWidth
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  {isChecking ? (
                    <CheckIcon />
                  ) : isAvailable ? (
                    <AvalableIcon color="success" />
                  ) : shortCode ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              }
              inputProps={{ maxLength: 24 }}
            />
          </FormControl>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <br />
        </>
      )}
      <Button
        variant="contained"
        onClick={handleCreateShortLink}
        disabled={!originalUrl || !!(shortCode && !isAvailable)}
        sx={{ mt: 2 }}
      >
        Create
      </Button>
      {shortLink && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Your Short Link:</Typography>
          <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
            {shortLink}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => copyToClipboard(shortLink)}
            sx={{ mt: 2 }}
          >
            Copy
          </Button>
        </Box>
      )}
    </Paper>
  );
};
