"use client";

/* eslint-disable security/detect-object-injection */
import React from "react";
import {
  Stack,
  Button,
  Typography,
  Divider,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";
import { ColorPicker } from "@/components/ui";
import {
  Section,
  SectionStyle,
  WidthMode,
  DropShadowLevel,
  HeroTemplateData,
} from "../services/heroPageApi";
// Template editing is not shown inside Build

interface HeroSettingsFormProps {
  sections: Section[];
  canAddMore: boolean;
  onAddSection: () => void;
  onRemoveSection: (order: number) => void;
  onUpdateSection?: (section: Section) => void;
  onReorderSections?: (sections: Section[]) => void;
}

export const HeroSettingsForm: React.FC<HeroSettingsFormProps> = ({
  sections,
  canAddMore,
  onAddSection,
  onRemoveSection,
  onUpdateSection,
}) => {
  const defaultSectionStyle = (): SectionStyle => ({
    global: {
      backgroundColor: "#ffffff",
      borderRadius: { tl: 0, tr: 0, br: 0, bl: 0 },
      dropShadow: "NONE",
      marginBottomPx: 0,
    },
    responsive: {
      desktop: {
        widthMode: "FULL",
        customWidthPx: undefined,
        heightPx: undefined,
        paddingPx: 0,
      },
      tablet: {
        widthMode: "FULL",
        customWidthPx: undefined,
        heightPx: undefined,
        paddingPx: 0,
      },
      mobile: {
        widthMode: "FULL",
        customWidthPx: undefined,
        heightPx: undefined,
        paddingPx: 0,
      },
    },
  });

  const updateStyle = (
    s: Section,
    updater: (style: SectionStyle) => SectionStyle
  ) => {
    if (!onUpdateSection) return;
    const next: Section = {
      ...s,
      style: updater(s.style || defaultSectionStyle()),
    } as Section;
    onUpdateSection(next);
  };

  return (
    <Stack spacing={2} sx={{ minWidth: 360 }}>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={onAddSection}
          disabled={!canAddMore}
        >
          Add Section
        </Button>
        {!canAddMore && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ alignSelf: "center" }}
          >
            Maximum 5 sections reached
          </Typography>
        )}
      </Stack>

      <Divider />

      <Stack spacing={2}>
        {sections.map((s) => {
          const style = s.style || defaultSectionStyle();
          const sectionAnchorId = `hero-section-${s.order}`;
          return (
            <Stack
              key={s.order}
              spacing={1}
              sx={{ border: "1px solid #e5e7eb", borderRadius: 1, p: 1.5 }}
              id={sectionAnchorId}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body2">
                  Section #{s.order} -{" "}
                  {String(
                    (s.templateData as HeroTemplateData | undefined)?.name ||
                      s.templateType
                  )}
                </Typography>
                <Button
                  size="small"
                  color="error"
                  onClick={() => onRemoveSection(s.order)}
                >
                  Remove
                </Button>
              </Stack>

              <Divider />
              <TextField
                size="small"
                label="Section Name"
                value={String(
                  (s.templateData as HeroTemplateData | undefined)?.name || ""
                )}
                onChange={(e) =>
                  onUpdateSection?.({
                    ...s,
                    templateData: {
                      ...(s.templateData as HeroTemplateData),
                      name: e.target.value,
                    },
                  } as Section)
                }
                placeholder="e.g., Hero, Features, Testimonials"
              />

              <Typography variant="subtitle2">Responsive</Typography>
              {(["desktop", "tablet", "mobile"] as const).map((bp) => (
                <Stack key={bp} direction="row" spacing={1}>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Width Mode ({bp})</InputLabel>
                    <Select
                      label={`Width Mode (${bp})`}
                      value={style.responsive[bp].widthMode}
                      onChange={(e) =>
                        updateStyle(s, (st) => ({
                          ...st,
                          responsive: {
                            ...st.responsive,
                            [bp]: {
                              ...st.responsive[bp],
                              widthMode: e.target.value as WidthMode,
                            },
                          },
                        }))
                      }
                    >
                      <MenuItem value="FULL">Full width</MenuItem>
                      <MenuItem value="CUSTOM">Custom</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    size="small"
                    type="number"
                    label={`Custom Width (${bp}, px)`}
                    value={style.responsive[bp].customWidthPx ?? ""}
                    onChange={(e) =>
                      updateStyle(s, (st) => ({
                        ...st,
                        responsive: {
                          ...st.responsive,
                          [bp]: {
                            ...st.responsive[bp],
                            customWidthPx: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          },
                        },
                      }))
                    }
                  />
                  <TextField
                    size="small"
                    type="number"
                    label={`Height (${bp}, px)`}
                    value={style.responsive[bp].heightPx ?? ""}
                    onChange={(e) =>
                      updateStyle(s, (st) => ({
                        ...st,
                        responsive: {
                          ...st.responsive,
                          [bp]: {
                            ...st.responsive[bp],
                            heightPx: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          },
                        },
                      }))
                    }
                  />
                  <TextField
                    size="small"
                    type="number"
                    label={`Padding (${bp}, px)`}
                    value={style.responsive[bp].paddingPx ?? 0}
                    onChange={(e) =>
                      updateStyle(s, (st) => ({
                        ...st,
                        responsive: {
                          ...st.responsive,
                          [bp]: {
                            ...st.responsive[bp],
                            paddingPx: Number(e.target.value) || 0,
                          },
                        },
                      }))
                    }
                  />
                </Stack>
              ))}

              <Divider />
              <Typography variant="subtitle2">Global</Typography>
              <Stack direction="row" spacing={1}>
                <ColorPicker
                  label="Background Color"
                  color={style.global.backgroundColor}
                  onChange={(hex) =>
                    updateStyle(s, (st) => ({
                      ...st,
                      global: { ...st.global, backgroundColor: hex },
                    }))
                  }
                />
                <TextField
                  size="small"
                  type="number"
                  label="Radius TL"
                  value={style.global.borderRadius.tl}
                  onChange={(e) =>
                    updateStyle(s, (st) => ({
                      ...st,
                      global: {
                        ...st.global,
                        borderRadius: {
                          ...st.global.borderRadius,
                          tl: Number(e.target.value) || 0,
                        },
                      },
                    }))
                  }
                />
                <TextField
                  size="small"
                  type="number"
                  label="TR"
                  value={style.global.borderRadius.tr}
                  onChange={(e) =>
                    updateStyle(s, (st) => ({
                      ...st,
                      global: {
                        ...st.global,
                        borderRadius: {
                          ...st.global.borderRadius,
                          tr: Number(e.target.value) || 0,
                        },
                      },
                    }))
                  }
                />
                <TextField
                  size="small"
                  type="number"
                  label="BR"
                  value={style.global.borderRadius.br}
                  onChange={(e) =>
                    updateStyle(s, (st) => ({
                      ...st,
                      global: {
                        ...st.global,
                        borderRadius: {
                          ...st.global.borderRadius,
                          br: Number(e.target.value) || 0,
                        },
                      },
                    }))
                  }
                />
                <TextField
                  size="small"
                  type="number"
                  label="BL"
                  value={style.global.borderRadius.bl}
                  onChange={(e) =>
                    updateStyle(s, (st) => ({
                      ...st,
                      global: {
                        ...st.global,
                        borderRadius: {
                          ...st.global.borderRadius,
                          bl: Number(e.target.value) || 0,
                        },
                      },
                    }))
                  }
                />
              </Stack>
              <Stack direction="row" spacing={1}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Drop Shadow</InputLabel>
                  <Select
                    label="Drop Shadow"
                    value={style.global.dropShadow}
                    onChange={(e) =>
                      updateStyle(s, (st) => ({
                        ...st,
                        global: {
                          ...st.global,
                          dropShadow: e.target.value as DropShadowLevel,
                        },
                      }))
                    }
                  >
                    <MenuItem value="NONE">None</MenuItem>
                    <MenuItem value="LIGHT">Light</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="STRONG">Strong</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  type="number"
                  label="Bottom Margin (px)"
                  value={style.global.marginBottomPx}
                  onChange={(e) =>
                    updateStyle(s, (st) => ({
                      ...st,
                      global: {
                        ...st.global,
                        marginBottomPx: Number(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </Stack>

              {/* Template controls removed per request */}
            </Stack>
          );
        })}
        {sections.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No sections added yet
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default HeroSettingsForm;
