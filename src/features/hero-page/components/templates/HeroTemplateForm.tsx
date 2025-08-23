"use client";

import React from "react";
import {
  Stack,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import type { HeroTemplateData } from "../../services/heroPageApi";

interface HeroTemplateFormProps {
  data: HeroTemplateData;
  onChange: (data: HeroTemplateData) => void;
}

export const HeroTemplateForm: React.FC<HeroTemplateFormProps> = ({
  data,
  onChange,
}) => {
  return (
    <Stack spacing={1.5}>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Media Type</InputLabel>
        <Select
          label="Media Type"
          value={data.mediaType}
          onChange={(e) =>
            onChange({ ...data, mediaType: e.target.value as "image" | "video" })
          }
        >
          <MenuItem value="image">Image</MenuItem>
          <MenuItem value="video">Video</MenuItem>
        </Select>
      </FormControl>
      <TextField
        size="small"
        label="Media URL"
        value={data.mediaUrl}
        onChange={(e) => onChange({ ...data, mediaUrl: e.target.value })}
        placeholder="/images/hero.jpg or https://..."
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={data.showDescription}
            onChange={(e) =>
              onChange({ ...data, showDescription: e.target.checked })
            }
          />
        }
        label="Show Description"
      />
      {data.showDescription && (
        <TextField
          size="small"
          label="Description"
          value={data.description ?? ""}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          multiline
          minRows={2}
        />
      )}
      <FormControlLabel
        control={
          <Checkbox
            checked={data.showButton}
            onChange={(e) =>
              onChange({ ...data, showButton: e.target.checked })
            }
          />
        }
        label="Show Button"
      />
      {data.showButton && (
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            label="Button Label"
            value={data.buttonLabel ?? ""}
            onChange={(e) => onChange({ ...data, buttonLabel: e.target.value })}
          />
          <TextField
            size="small"
            label="Button URL"
            value={data.buttonUrl ?? ""}
            onChange={(e) => onChange({ ...data, buttonUrl: e.target.value })}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Shape</InputLabel>
            <Select
              label="Shape"
              value={data.buttonShape}
              onChange={(e) =>
                onChange({ ...data, buttonShape: e.target.value as "ROUNDED" | "CIRCLE" | "SQUARE" })
              }
            >
              <MenuItem value="ROUNDED">Rounded</MenuItem>
              <MenuItem value="CIRCLE">Circle</MenuItem>
              <MenuItem value="SQUARE">Square</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      )}
    </Stack>
  );
};

export default HeroTemplateForm;
