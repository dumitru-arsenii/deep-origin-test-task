import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getClient } from "@/utils/trpc-client";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { showNotification } from "@/utils/showNotification";

const signUpSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
    name: z.string().min(1, "Name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    getClient()
      .auth.signup.mutate(data)
      .then(({ token }) => {
        localStorage.setItem("token", token);
        window.location.href = "/";
      })
      .catch((error) => {
        if (error?.data?.code === "BAD_REQUEST") {
          showNotification({
            title: "Error",
            description:
              error.message || "Invalid input. Please check your data.",
            type: "error",
          });
        }
        if (error?.data?.code === "CONFLICT") {
          showNotification({
            title: "Error",
            description:
              error.message ||
              "Email already exists. Please use a different email.",
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
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign Up
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please fill in the form below to create an account.
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                variant="standard"
                label="Name"
                id="name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                variant="standard"
                label="Email"
                id="email"
                type="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                variant="standard"
                label="Password"
                id="password"
                type="password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                variant="standard"
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </Box>
            <Box sx={{ mb: 2, mt: 8 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Container>
  );
};
