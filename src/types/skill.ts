export type SkillCategory =
  | 'Planning'
  | 'Building'
  | 'Review'
  | 'Testing'
  | 'Shipping'
  | 'Safety'
  | 'Utilities';

export interface Skill {
  name: string;
  slashCommand: string;
  version: string;
  preambleTier: number;
  description: string;
  shortDescription: string;
  descriptionCn: string;
  shortDescriptionCn: string;
  allowedTools: string[];
  category: SkillCategory;
  categoryCn: string;
  sourcePath: string;
}

export interface CategoryInfo {
  name: SkillCategory;
  displayName: string;
  count: number;
  color: string;
}