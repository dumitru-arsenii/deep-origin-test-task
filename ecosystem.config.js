module.exports = {
  apps: [
    {
      name: "client", // Name for the client app
      script: "npm",
      args: "run start", // Start the client using the Turbo start script
      cwd: "./packages/client", // Path to the client package
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "server", // Name for the server app
      script: "npm",
      args: "run start", // Start the server using the Turbo start script
      cwd: "./packages/server", // Path to the server package
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
