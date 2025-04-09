import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getClient } from "@/utils/trpc-client";
import { Box, Button, TextField, Typography } from "@mui/material";
import { showNotification } from "@/utils/showNotification";

const signInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignInForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInFormData) => {
    getClient()
      .auth.login.mutate(data)
      .then((token) => {
        localStorage.setItem("token", token);
        window.location.href = "/";
      })
      .catch((error) => {
        if (
          error?.data?.code === "NOT_FOUND" ||
          error?.data?.code === "UNAUTHORIZED"
        ) {
          showNotification({
            title: "Error",
            description: error.message || "Invalid email or password.",
            type: "error",
          });
        } else {
          console.error("Unexpected error:", error);
          showNotification({
            title: "Error",
            description: "Something went wrong. Please try again later.",
            type: "error",
          });
        }
      });
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        mb: 4,
        p: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Sign In
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please enter your credentials to log in.
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2} mt={4}>
          <TextField
            fullWidth
            id="email"
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Box>
        <Box mb={2} mt={4}>
          <TextField
            fullWidth
            id="password"
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 6 }}
        >
          Sign In
        </Button>
      </form>
    </Box>
  );
};
