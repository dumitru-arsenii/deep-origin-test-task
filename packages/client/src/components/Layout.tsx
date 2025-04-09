import React from "react";
import { Toolbar, Box } from "@mui/material";
import { Header } from "./Header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "#FAFBFF",
      }}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Header />
        <Toolbar />
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            alignItems: "center",
            width: {
              sm: 600,
              md: 900,
              lg: 1200,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
