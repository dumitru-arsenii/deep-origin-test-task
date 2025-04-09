import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { SignUpForm } from "./SignUpForm";
import { SignInForm } from "./SignInForm";
import { useUser } from "@/contexts/userContext";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export function Header() {
  const { user } = useUser();
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        p: 2,
        display: "flex",
        flexDirection: "row-reverse",
      }}
    >
      {user ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            width: "100%",
          }}
        >
          <Typography variant="body1">
            Hello <b>{user.name}</b>
          </Typography>
          <Button
            variant="text"
            color="inherit"
            size="small"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </Button>
        </Box>
      ) : (
        <Box>
          <Button
            variant="text"
            color="inherit"
            onClick={() => setSignInModalOpen(true)}
          >
            Sign In
          </Button>
          <Button
            variant="text"
            color="inherit"
            onClick={() => setSignUpModalOpen(true)}
          >
            Sign Up
          </Button>
        </Box>
      )}

      <Modal open={signUpModalOpen} onClose={() => setSignUpModalOpen(false)}>
        <Box sx={modalStyle}>
          <SignUpForm />
        </Box>
      </Modal>

      <Modal open={signInModalOpen} onClose={() => setSignInModalOpen(false)}>
        <Box sx={modalStyle}>
          <SignInForm />
        </Box>
      </Modal>
    </Paper>
  );
}
