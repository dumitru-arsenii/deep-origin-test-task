import React from "react";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Chip,
  Paper,
} from "@mui/material";
import { useUserLinks } from "@/contexts/userLinksContext";

export const LinksTable = () => {
  const { links } = useUserLinks();

  return (
    <Paper sx={{ p: 3, borderColor: "#f9fafc", borderRadius: 2, mt: 8 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            My Links
          </Typography>
        </Box>
      </Box>

      {links.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Short Code",
                "URL",
                "Clicks",
                "Unique Visitors",
                "Created At",
                "Status",
              ].map((header) => (
                <TableCell key={header} sx={{ fontWeight: 600 }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {links.map((link, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <Typography
                    component="a"
                    href={`${window.location.origin}/${link.shortCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: "none", color: "primary.main" }}
                  >
                    {`${window.location.origin}/${link.shortCode}`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    component="a"
                    href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: "none", color: "primary.main" }}
                  >
                    {link.originalUrl}
                  </Typography>
                </TableCell>
                <TableCell>{link.clicks}</TableCell>
                <TableCell>{link.uniqueVisitors}</TableCell>
                <TableCell>
                  {new Date(link.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      link?.expireDate && new Date(link.expireDate) < new Date()
                        ? "Expired"
                        : "Active"
                    }
                    color={
                      link?.expireDate && new Date(link.expireDate) < new Date()
                        ? "error"
                        : "success"
                    }
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="textSecondary">
            No links yet created. Don’t be shy, let’s start!
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
