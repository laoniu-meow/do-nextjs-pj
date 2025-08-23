"use client";

/* eslint-disable security/detect-object-injection */
import React, { useEffect, useRef, useState } from "react";
import { Button, Stack } from "@mui/material";
import { Typography } from "@/components/ui";
import { Section, SectionStyle } from "../services/heroPageApi";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
// Avoid importing shared API services here to minimize devtools noise

interface HeroPreviewProps {
  sections: Section[];
  onEditSection?: (order: number) => void;
}

export const HeroPreview: React.FC<HeroPreviewProps> = ({
  sections,
  onEditSection,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [minViewportHeight, setMinViewportHeight] = useState<number>(600);
  const [pageBackgroundColor, setPageBackgroundColor] =
    useState<string>("#f9fafb");

  // Fetch global page background color from Header & Main settings
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetchWithAuth("/api/settings/header-main");
        if (!res.ok) return;
        const data = await res.json();
        const settings = data.settings || data;
        if (!isMounted) return;
        const bg =
          settings.pageBackgroundColor || settings.backgroundColor || "#f9fafb";
        setPageBackgroundColor(bg);
      } catch {
        // Ignore; keep default color
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate a viewport-fitted minimum height for the preview container
  useEffect(() => {
    const calculateMinHeight = () => {
      const top = containerRef.current?.getBoundingClientRect().top ?? 0;
      const paddingBottom = 24;
      const availableHeight = Math.max(
        320,
        Math.floor(window.innerHeight - top - paddingBottom)
      );
      setMinViewportHeight(availableHeight);
    };

    calculateMinHeight();
    window.addEventListener("resize", calculateMinHeight);
    return () => window.removeEventListener("resize", calculateMinHeight);
  }, []);

  const getPreviewContainerStyle = (): React.CSSProperties => ({
    backgroundColor: pageBackgroundColor,
    width: "100%",
    minHeight: `${minViewportHeight}px`,
    border: "2px solid #e5e7eb",
    boxSizing: "border-box",
    position: "relative",
    overflow: "visible",
  });

  const getSectionStyle = (
    style: SectionStyle | undefined
  ): React.CSSProperties => {
    const st = style || {
      global: {
        backgroundColor: "#ffffff",
        borderRadius: { tl: 0, tr: 0, br: 0, bl: 0 },
        dropShadow: "NONE" as const,
        marginBottomPx: 0,
      },
      responsive: {
        desktop: {
          widthMode: "FULL" as const,
          customWidthPx: undefined,
          heightPx: undefined,
          paddingPx: 0,
        },
        tablet: {
          widthMode: "FULL" as const,
          customWidthPx: undefined,
          heightPx: undefined,
          paddingPx: 0,
        },
        mobile: {
          widthMode: "FULL" as const,
          customWidthPx: undefined,
          heightPx: undefined,
          paddingPx: 0,
        },
      },
    };

    const shadowMap: Record<
      NonNullable<SectionStyle>["global"]["dropShadow"],
      string
    > = {
      NONE: "none",
      LIGHT: "0 2px 6px rgba(0,0,0,0.08)",
      MEDIUM: "0 6px 16px rgba(0,0,0,0.12)",
      STRONG: "0 12px 28px rgba(0,0,0,0.18)",
    };

    return {
      background: st.global.backgroundColor,
      borderRadius: `${st.global.borderRadius.tl}px ${st.global.borderRadius.tr}px ${st.global.borderRadius.br}px ${st.global.borderRadius.bl}px`,
      border: "1px dashed #cbd5e1",
      boxShadow: shadowMap[st.global.dropShadow],
      marginBottom: `${st.global.marginBottomPx}px`,
      width:
        st.responsive.desktop.widthMode === "CUSTOM" &&
        st.responsive.desktop.customWidthPx
          ? `${st.responsive.desktop.customWidthPx}px`
          : "100%",
      height: st.responsive.desktop.heightPx
        ? `${st.responsive.desktop.heightPx}px`
        : undefined,
      padding: `${st.responsive.desktop.paddingPx || 0}px`,
    };
  };

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <Typography variant="h6">Hero Preview</Typography>
        <Typography variant="body2" color="text.secondary">
          Live preview of your hero page (background from Header & Main)
        </Typography>
      </div>

      <div ref={containerRef} style={getPreviewContainerStyle()}>
        {/* Simple placeholder rendering of sections (can be expanded later) */}
        {sections.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              padding: 24,
              color: "#6b7280",
            }}
          >
            No sections yet. Click Build to add sections.
          </div>
        ) : (
          <div style={{ padding: 16 }}>
            {sections.map((s) => {
              const style = getSectionStyle(s.style);
              return (
                <div key={s.order} style={style}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <strong>Section #{s.order}</strong>
                    {onEditSection && (
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onEditSection(s.order)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            // Move Up in preview (UI-side reorder); renumber after swap
                            const idx = sections.findIndex(
                              (x) => x.order === s.order
                            );
                            if (idx <= 0) return;
                            const next = [...sections];
                            [next[idx - 1], next[idx]] = [
                              next[idx],
                              next[idx - 1],
                            ];
                            const renumbered = next.map((sec, i) => ({
                              ...sec,
                              order: i + 1,
                            }));
                            // Dispatch via custom event for parent to handle
                            window.dispatchEvent(
                              new CustomEvent("hero:reorder", {
                                detail: renumbered,
                              })
                            );
                          }}
                        >
                          Move Up
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            const idx = sections.findIndex(
                              (x) => x.order === s.order
                            );
                            if (idx === -1 || idx >= sections.length - 1)
                              return;
                            const next = [...sections];
                            [next[idx], next[idx + 1]] = [
                              next[idx + 1],
                              next[idx],
                            ];
                            const renumbered = next.map((sec, i) => ({
                              ...sec,
                              order: i + 1,
                            }));
                            window.dispatchEvent(
                              new CustomEvent("hero:reorder", {
                                detail: renumbered,
                              })
                            );
                          }}
                        >
                          Move Down
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                  {/* Removed extra name line below header as requested */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroPreview;
