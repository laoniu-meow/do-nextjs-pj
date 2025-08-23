export type PageTemplateType = 'HERO' | 'INFOGRAPH' | 'CARD_INFO';

export type HeroTemplateData = {
  name?: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  showDescription: boolean;
  description?: string;
  showButton: boolean;
  buttonLabel?: string;
  buttonUrl?: string;
  buttonShape: 'ROUNDED' | 'CIRCLE' | 'SQUARE';
};

export type InfographTemplateData = {
  title: string;
  description?: string;
  items: { label: string; number: number }[];
  animateNumbers: boolean;
  animationDurationMs: number;
};

export type CardInfoTemplateData = {
  title?: string;
  cards: { heading: string; body: string; imageUrl?: string; linkUrl?: string }[];
  columns?: { xs?: number; sm?: number; md?: number };
};

export type Section =
  | { id?: string; order: number; templateType: 'HERO'; templateData: HeroTemplateData; style?: SectionStyle }
  | { id?: string; order: number; templateType: 'INFOGRAPH'; templateData: InfographTemplateData; style?: SectionStyle }
  | { id?: string; order: number; templateType: 'CARD_INFO'; templateData: CardInfoTemplateData; style?: SectionStyle };

export type WidthMode = 'FULL' | 'CUSTOM';
export type DropShadowLevel = 'NONE' | 'LIGHT' | 'MEDIUM' | 'STRONG';

export type ResponsiveBlock = {
  widthMode: WidthMode; // FULL or CUSTOM
  customWidthPx?: number; // when CUSTOM
  heightPx?: number;
  paddingPx?: number; // inner padding
};

export type SectionStyle = {
  global: {
    backgroundColor: string;
    borderRadius: { tl: number; tr: number; br: number; bl: number };
    dropShadow: DropShadowLevel;
    marginBottomPx: number;
  };
  responsive: {
    desktop: ResponsiveBlock;
    tablet: ResponsiveBlock;
    mobile: ResponsiveBlock;
  };
};

const API = {
  HERO_STAGING: '/api/settings/hero/staging',
  HERO_PRODUCTION: '/api/settings/hero/production',
};

export class HeroPageApi {
  static async getStagingSections(): Promise<Section[]> {
    const res = await fetch(API.HERO_STAGING);
    if (!res.ok) throw new Error(`Failed to fetch hero staging: ${res.status}`);
    const data = await res.json();
    return data.sections ?? [];
  }

  static async saveStagingSections(sections: Section[]): Promise<Section[]> {
    const res = await fetch(API.HERO_STAGING, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections }),
    });
    if (!res.ok) throw new Error(`Failed to save hero staging: ${res.status}`);
    const data = await res.json();
    return data.sections ?? [];
  }

  static async clearStaging(): Promise<void> {
    const res = await fetch(API.HERO_STAGING, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to clear hero staging: ${res.status}`);
  }

  static async getProductionSections(): Promise<Section[]> {
    const res = await fetch(API.HERO_PRODUCTION);
    if (!res.ok) throw new Error(`Failed to fetch hero production: ${res.status}`);
    const data = await res.json();
    return data.sections ?? [];
  }

  static async uploadToProduction(): Promise<Section[]> {
    const res = await fetch(API.HERO_PRODUCTION, { method: 'POST' });
    if (!res.ok) throw new Error(`Failed to upload hero to production: ${res.status}`);
    const data = await res.json();
    return data.sections ?? [];
  }
}


