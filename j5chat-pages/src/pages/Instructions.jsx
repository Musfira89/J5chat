import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import security from "../assets/securityKeys.png";
import securityMessage from "../assets/securityMessage.png";

const Instructions = () => {
  return (
    <Box
      sx={{
        maxWidth: 880,
        mx: "auto",
        px: { xs: 3, sm: 4 },
        py: { xs: 6, sm: 8 },
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h4"
        fontWeight={800}
        textAlign="center"
        color="text.primary"
        mb={1}
      >
        Joining Instructions
      </Typography>
      <Typography
        variant="body1"
        textAlign="center"
        color="text.secondary"
        mb={5}
      >
        Follow the steps below to join the J5.Chat community.
      </Typography>

      {/* Instruction Steps */}
      <Box display="flex" flexDirection="column" gap={5}>
        {/* Step 1 */}
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Step 1: Paste Your Invite Link
          </Typography>
          <Typography color="text.secondary" fontSize={15.5} lineHeight={1.7}>
            Enter the link provided by the admin into the input field above.
            <br />
            <Typography
              component="span"
              fontStyle="italic"
              fontSize={14.5}
              color="text.disabled"
            >
              Example: https://j5.chat/#/register?registration_token=J5-XXXXXX
            </Typography>
          </Typography>
        </Box>

        {/* Step 2 */}
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Step 2: Register Your Account
          </Typography>
          <Typography color="text.secondary" fontSize={15.5} lineHeight={1.7}>
            After submitting the invite, you'll be redirected to the
            registration screen. Create your account with a username and a
            secure password. This step is mandatory.
          </Typography>
        </Box>

        {/* Security Notice */}
        <Box
          sx={{
            borderRadius: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#1f1f1f" : "#f8f9fa",
            px: 3,
            py: 2.5,
            border: (theme) =>
              `1px solid ${theme.palette.mode === "dark" ? "#333" : "#e0e0e0"}`,
          }}
        >
          <Typography fontWeight={700} fontSize={15} mb={0.5}>
            Important Notice
          </Typography>
          <Typography fontSize={15} color="text.secondary" lineHeight={1.7}>
            Public signups are disabled. This invite link is your only
            opportunity to register. Please complete your account creation
            immediately.
          </Typography>
        </Box>

        {/* Step 3 */}
        <Grid item xs={12} md={4}>
          <Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Step 3: Secure Messages with Key Backup
            </Typography>

            <Typography color="text.secondary" fontSize={15.5} lineHeight={1.7}>
              After registration, users can join channels, send messages, and
              sign out. Upon signing out, the following message may appear:
            </Typography>

            <Typography
              fontStyle="italic"
              fontSize={14.5}
              color="text.disabled"
              mt={1}
            >
              “You may lose access to your messages if you don’t back up your
              encryption keys.”
            </Typography>

            {/* Security Message Image */}
            <Box
              component="img"
              src={securityMessage.src || securityMessage}
              alt="Security Warning"
              sx={{
                mt: 2,
                width: "100%",
                height: "auto",
                borderRadius: 2,
              }}
            />

            <Typography
              color="text.secondary"
              fontSize={15.5}
              lineHeight={1.7}
              mt={2}
            >
              Choose <strong>Start using Key Backup</strong> and follow the
              instructions. You will see a <strong>“Set Up Recovery”</strong>{" "}
              button — click it to .You’ll receive a 12-word secret recovery
              phrase. Save the phrase securely and{" "}
              <strong>never share it</strong>.
            </Typography>

            {/* Key Backup Image */}
            <Box
              component="img"
              src={security.src || security}
              alt="Key Backup"
              sx={{
                mt: 2,
                width: "100%",
                height: "auto",
                borderRadius: 2,
              }}
            />
          </Box>
        </Grid>

        {/* Step 4 */}
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Step 4: Sign In Later
          </Typography>
          <Typography color="text.secondary" fontSize={15.5} lineHeight={1.7}>
            Visit{" "}
            <Box component="span" fontWeight={600} color="primary.main">
              https://j5.chat/#/login
            </Box>{" "}
            to log in anytime using your username and password.
            <br />
            If needed, enter your recovery phrase to restore messages.
          </Typography>
        </Box>
      </Box>

      {/* PDF Download Button */}
      <Box mt={6} textAlign="center">
        <Button
          component="a"
          href="/custom/Instructions.pdf"
          download
          target="_blank"
          rel="noopener"
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 15,
            backgroundColor: "#000",
            color: "#fff",
            px: 4,
            py: 1.4,
            "&:hover": {
              backgroundColor: "#222",
            },
          }}
        >
          Download as PDF
        </Button>
      </Box>
    </Box>
  );
};

export default Instructions;
