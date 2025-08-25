"use client";

import React from "react";
import { PageLayout, MainContainerBox } from "@/components/ui";
import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  Divider,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  IconButton,
  Box,
  Alert,
} from "@mui/material";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

export default function DonationSettingsPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Donations state
  const [donations, setDonations] = React.useState<
    Array<{
      id?: string;
      description: string;
      amount: number;
      campaignName: string;
      startDateTime: string;
      endDateTime: string;
      isOneTime: boolean;
      notes: string;
      isActive: boolean;
    }>
  >([]);

  async function loadDonations() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth("/api/settings/donations", {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to load donations");
      setDonations(json.data.donations || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadDonations();
  }, []);

  async function saveDonations() {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Validate donations
      if (donations.length === 0) {
        throw new Error("At least one donation campaign is required");
      }

      const donationsToSave = donations.map(({ ...donation }) => ({
        description: donation.description.trim(),
        amount: donation.amount,
        campaignName: donation.campaignName.trim(),
        startDateTime: donation.startDateTime,
        endDateTime: donation.endDateTime,
        isOneTime: donation.isOneTime,
        notes: donation.notes.trim() || null,
        isActive: donation.isActive,
      }));

              // Validate required fields
        for (const donation of donationsToSave) {
          if (!donation.campaignName) throw new Error("Donation Title is required");
          if (donation.amount <= 0)
            throw new Error("Amount must be greater than 0");

          // If both dates are set, validate that end date is after start date
          if (donation.startDateTime && donation.endDateTime) {
            if (
              new Date(donation.startDateTime) >= new Date(donation.endDateTime)
            ) {
              throw new Error("End date must be after start date");
            }
          }
        }

      const res = await fetchWithAuth("/api/settings/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donations: donationsToSave }),
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to save donations");

      setSuccess("Donation campaigns saved successfully");
      await loadDonations(); // Reload to get updated IDs
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function addDonation() {
    setDonations([
      ...donations,
      {
        description: "",
        amount: 0,
        campaignName: "",
        startDateTime: "",
        endDateTime: "",
        isOneTime: true,
        notes: "",
        isActive: true,
      },
    ]);
  }

  function removeDonation(index: number) {
    setDonations(donations.filter((_, i) => i !== index));
  }

  function updateDonation(
    index: number,
    field: string,
    value: string | number | boolean
  ) {
    setDonations(
      donations.map((donation, i) =>
        i === index ? { ...donation, [field]: value } : donation
      )
    );
  }

  return (
    <PageLayout
      title="Donation Settings"
      description="Manage your donation campaigns and their information"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Donations" },
      ]}
      maxWidth="xl"
    >
      <MainContainerBox title="Donation Management">
        <Card>
          <CardHeader
            title="Donation Campaign Settings"
            subheader="Manage your donation campaigns"
            action={
              <Button
                variant="contained"
                onClick={addDonation}
                disabled={loading}
                startIcon={<SaveIcon />}
              >
                Add Campaign
              </Button>
            }
          />
          <CardContent>
            <Stack spacing={3}>
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" onClose={() => setSuccess(null)}>
                  {success}
                </Alert>
              )}

              {donations.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  No donation campaigns configured. Click &quot;Add
                  Campaign&quot; to get started.
                </Typography>
              ) : (
                donations.map((donation, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Stack spacing={2}>
                        {/* Donation Title & Amount Row */}
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                          alignItems="flex-start"
                        >
                          <TextField
                            label="Donation Title"
                            value={donation.campaignName}
                            onChange={(e) =>
                              updateDonation(
                                index,
                                "campaignName",
                                e.target.value
                              )
                            }
                            disabled={loading}
                            sx={{ flexGrow: 1 }}
                            size="small"
                            required
                          />
                          <TextField
                            label="Amount"
                            type="number"
                            value={donation.amount}
                            onChange={(e) =>
                              updateDonation(
                                index,
                                "amount",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            disabled={loading}
                            sx={{ width: { xs: "100%", sm: 150 } }}
                            size="small"
                            inputProps={{ min: 0, step: 0.01 }}
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={donation.isOneTime}
                                onChange={(e) =>
                                  updateDonation(
                                    index,
                                    "isOneTime",
                                    e.target.checked
                                  )
                                }
                                disabled={loading}
                              />
                            }
                            label={
                              donation.isOneTime ? "One Time" : "Recurring"
                            }
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={donation.isActive}
                                onChange={(e) =>
                                  updateDonation(
                                    index,
                                    "isActive",
                                    e.target.checked
                                  )
                                }
                                disabled={loading}
                              />
                            }
                            label="Active"
                          />
                        </Stack>

                        {/* Campaign Name Row */}
                        <TextField
                          label="Campaign Name (optional)"
                          value={donation.description}
                          onChange={(e) =>
                            updateDonation(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          disabled={loading}
                          size="small"
                          helperText="Leave empty for general campaign"
                        />

                        {/* Date Range Row */}
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                        >
                          <TextField
                            label="Start Date (optional)"
                            type="datetime-local"
                            value={donation.startDateTime}
                            onChange={(e) =>
                              updateDonation(
                                index,
                                "startDateTime",
                                e.target.value
                              )
                            }
                            disabled={loading}
                            sx={{ flexGrow: 1 }}
                            size="small"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            helperText="Leave empty for forever donation"
                          />
                          <TextField
                            label="End Date (optional)"
                            type="datetime-local"
                            value={donation.endDateTime}
                            onChange={(e) =>
                              updateDonation(
                                index,
                                "endDateTime",
                                e.target.value
                              )
                            }
                            disabled={loading}
                            sx={{ flexGrow: 1 }}
                            size="small"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            helperText="Leave empty for forever donation"
                          />
                        </Stack>

                        {/* Description */}
                        <TextField
                          label="Description (optional)"
                          value={donation.notes}
                          onChange={(e) =>
                            updateDonation(index, "notes", e.target.value)
                          }
                          disabled={loading}
                          multiline
                          rows={2}
                          size="small"
                          helperText="Leave empty if no additional details needed"
                        />

                        {/* Additional Notes */}
                        <TextField
                          label="Additional Notes (optional)"
                          value={donation.notes}
                          onChange={(e) =>
                            updateDonation(index, "notes", e.target.value)
                          }
                          disabled={loading}
                          multiline
                          rows={2}
                          size="small"
                          helperText="Any extra information or special instructions"
                        />

                        <Box display="flex" justifyContent="flex-end" gap={1}>
                          <IconButton
                            onClick={() => removeDonation(index)}
                            disabled={loading}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              )}

              <Divider />

              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => setDonations([])}
                  disabled={loading || donations.length === 0}
                >
                  Clear All
                </Button>
                <Button
                  variant="contained"
                  onClick={saveDonations}
                  disabled={loading || donations.length === 0}
                  startIcon={<SaveIcon />}
                >
                  Save All Campaigns
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </MainContainerBox>
    </PageLayout>
  );
}
