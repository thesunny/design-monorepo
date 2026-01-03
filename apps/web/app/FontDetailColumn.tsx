"use client";

import { useEffect, useState } from "react";
import { IconClipboard, IconCheck, IconRefresh } from "@tabler/icons-react";
import { Slider } from "@mantine/core";
import type { Font } from "../data/types";
import { FontWeightRow } from "./FontWeightRow";
import { NormalizedText } from "./components/NormalizedText";
import { isMonospaceFont } from "./utils";

const PARAGRAPH_NORMALIZATION_TEXT =
  "this is a simple sample text that represents average spacing and letter frequency";

type FontDetailColumnProps = {
  font: Font | null;
  previewText: string;
};

function getAllAvailableWeights(weights: number[]): number[] {
  const standardWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  return standardWeights.filter((w) => weights.includes(w));
}

function generateFontLink(font: Font): string {
  const familyParam = font.name.replace(/ /g, "+");
  const weights = font.weights.join(";");
  const italicWeights = font.styles.includes("italic")
    ? font.weights.map((w) => `1,${w}`).join(";")
    : "";
  const wghtParam = font.styles.includes("italic")
    ? `ital,wght@0,${weights};${italicWeights}`
    : `wght@${weights}`;

  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${familyParam}:${wghtParam}&display=swap" rel="stylesheet">`;
}

function generateCssExample(font: Font): string {
  const fontFamily = font.name.includes(" ") ? `"${font.name}"` : font.name;
  return `.heading {
  font-family: ${fontFamily}, sans-serif;
  font-weight: 700;
}

.body {
  font-family: ${fontFamily}, sans-serif;
  font-weight: 400;
}`;
}

// Helper to build font-variation-settings string
function buildFontVariationSettings(
  axisValues: Record<string, number>
): string {
  return Object.entries(axisValues)
    .map(([tag, value]) => `"${tag}" ${value}`)
    .join(", ");
}

// Helper to get display name for common axes
function getAxisDisplayName(tag: string): string {
  const names: Record<string, string> = {
    wght: "Weight",
    wdth: "Width",
    slnt: "Slant",
    ital: "Italic",
    opsz: "Optical Size",
    GRAD: "Grade",
    XTRA: "X-Height",
    YOPQ: "Y Opacity",
    XOPQ: "X Opacity",
    YTLC: "Lowercase Height",
    YTUC: "Uppercase Height",
    YTAS: "Ascender Height",
    YTDE: "Descender Depth",
    YTFI: "Figure Height",
    FILL: "Fill",
    SOFT: "Softness",
    MONO: "Monospace",
    CASL: "Casual",
    CRSV: "Cursive",
  };
  return names[tag] || tag;
}

export function FontDetailColumn({ font, previewText }: FontDetailColumnProps) {
  // State for variable font axis values
  const [axisValues, setAxisValues] = useState<Record<string, number>>({});

  // Reset axis values when font changes
  useEffect(() => {
    if (font?.variable && font.metadata.axes.length > 0) {
      const defaults: Record<string, number> = {};
      for (const axis of font.metadata.axes) {
        defaults[axis.tag] = axis.defaultValue;
      }
      setAxisValues(defaults);
    } else {
      setAxisValues({});
    }
  }, [font]);

  if (!font) {
    return (
      <div className="w-[480px] shrink-0 flex flex-col border-l border-neutral-200">
        <div className="flex items-center border-b border-neutral-200 px-8 h-12">
          <span className="text-sm font-medium text-neutral-900">
            Font Details
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <p className="text-neutral-500 text-sm">
            Hover over a font to see details.
          </p>
        </div>
      </div>
    );
  }

  const displayWeights = getAllAvailableWeights(font.weights);
  const hasItalic = font.styles.includes("italic");
  const isMonospace = isMonospaceFont(font);

  // Get non-wght axes for variable fonts
  const variableAxes = font.variable
    ? font.metadata.axes.filter((axis) => axis.tag !== "wght")
    : [];

  // Build font-variation-settings string (excluding wght which is handled by font-weight)
  const fontVariationSettings =
    variableAxes.length > 0
      ? buildFontVariationSettings(
          Object.fromEntries(
            variableAxes.map((axis) => [
              axis.tag,
              axisValues[axis.tag] ?? axis.defaultValue,
            ])
          )
        )
      : undefined;

  return (
    <div className="w-[480px] shrink-0 flex flex-col border-l border-neutral-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-12 border-b border-neutral-200 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium text-neutral-900">{font.name}</h2>
          <div className="flex items-center gap-2">
            {hasItalic && (
              <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
                Italic
              </span>
            )}
            {font.variable && (
              <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
                Variable
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Font weights preview */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
          Weights
        </h3>
        <div className="space-y-3">
          {displayWeights.map((weight) => (
            <FontWeightRow
              key={weight}
              fontName={font.name}
              weight={weight}
              lineHeight={1.2}
              letterSpacing={0}
              previewText={previewText}
              fontSize={28}
              isMonospace={isMonospace}
              fontVariationSettings={fontVariationSettings}
            />
          ))}
        </div>

        {/* Italic variants if available */}
        {hasItalic && (
          <>
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4 mt-8">
              Italic Weights
            </h3>
            <div className="space-y-3">
              {displayWeights.map((weight) => (
                <FontWeightRow
                  key={`italic-${weight}`}
                  fontName={font.name}
                  weight={weight}
                  lineHeight={1.2}
                  letterSpacing={0}
                  previewText={previewText}
                  fontSize={28}
                  isMonospace={isMonospace}
                  showItalics={true}
                  hasItalic={true}
                  fontVariationSettings={fontVariationSettings}
                />
              ))}
            </div>
          </>
        )}

        {/* Body text preview */}
        <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4 mt-8">
          Body Text
        </h3>
        <div>
          <NormalizedText
            fontFamily={font.name}
            fontWeight={400}
            fontStyle="normal"
            lineHeight={1.5}
            letterSpacing={0}
            normalizedFontSize={16}
            normalizationText={PARAGRAPH_NORMALIZATION_TEXT}
            isMonospace={isMonospace}
          >
            Typography is the art and technique of arranging type to make
            written language legible, readable, and visually appealing when
            displayed. It involves selecting typefaces, point sizes, line
            lengths, line spacing, and letter spacing. <br />
            <br />
            Good design uses <strong>bold</strong> for emphasis,{" "}
            <em>italics</em> for tone, and <u>underlines</u> for links.
          </NormalizedText>
        </div>
      </div>

      {/* Variable font axis sliders - pinned to bottom */}
      {variableAxes.length > 0 && (
        <div className="border-t border-neutral-200 px-6 py-4 shrink-0">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
            Variable Axes
          </h3>
          <div className="space-y-4">
            {variableAxes.map((axis) => {
              const currentValue = axisValues[axis.tag] ?? axis.defaultValue;
              const isDefault = currentValue === axis.defaultValue;
              return (
                <div key={axis.tag}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-neutral-600">
                      {getAxisDisplayName(axis.tag)}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {currentValue}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Slider
                      className="flex-1"
                      value={currentValue}
                      onChange={(value) =>
                        setAxisValues((prev) => ({
                          ...prev,
                          [axis.tag]: value,
                        }))
                      }
                      min={axis.min}
                      max={axis.max}
                      step={axis.tag === "opsz" ? 0.1 : 1}
                      size="sm"
                      color="dark"
                      marks={[
                        { value: axis.min, label: String(axis.min) },
                        {
                          value: axis.defaultValue,
                          label: String(axis.defaultValue),
                        },
                        { value: axis.max, label: String(axis.max) },
                      ]}
                      styles={{ markLabel: { fontSize: "10px" } }}
                    />
                    <button
                      onClick={() =>
                        setAxisValues((prev) => ({
                          ...prev,
                          [axis.tag]: axis.defaultValue,
                        }))
                      }
                      className={`p-1 rounded transition-colors ${
                        isDefault
                          ? "text-neutral-300 cursor-default"
                          : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                      }`}
                      disabled={isDefault}
                      title="Reset to default"
                    >
                      <IconRefresh size={21} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Copy buttons */}
      <div className="px-6 py-5 shrink-0">
        <div className="flex justify-end gap-3">
          <CopyButton
            text={generateFontLink(font)}
            label="Copy HTML Link"
            variant="primary"
            style={{ width: 170 }}
          />
          <CopyButton
            text={generateCssExample(font)}
            label="CSS Example"
            variant="outline"
            style={{ width: 150 }}
          />
        </div>
      </div>
    </div>
  );
}

function CopyButton({
  text,
  label,
  variant,
  style,
}: {
  text: string;
  label: string;
  variant: "primary" | "outline";
  style?: React.CSSProperties;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseStyles =
    "flex items-center justify-center gap-2 px-0 py-2.5 text-sm font-medium rounded-md transition-colors cursor-pointer";
  const variantStyles =
    variant === "primary"
      ? "bg-[#066ED1] text-white hover:bg-[#0559A8]"
      : "border border-neutral-300 text-neutral-800 hover:bg-neutral-50 bg-white";

  return (
    <button
      onClick={handleCopy}
      className={`${baseStyles} ${variantStyles}`}
      style={{ fontSize: "14px", ...style }}
    >
      {copied ? (
        <IconCheck size={18} stroke={1.5} />
      ) : (
        <IconClipboard size={18} stroke={1.5} />
      )}
      {copied ? "Copied!" : label}
    </button>
  );
}
