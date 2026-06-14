export type SkillCategory =
  // v1 原始分类
  | 'Planning'
  | 'Building'
  | 'Review'
  | 'Testing'
  | 'Shipping'
  | 'Safety'
  | 'Utilities'
  // v2 Anthropic 九类分类法
  | 'Libraries & API Reference'
  | 'Product Verification'
  | 'Data Acquisition & Analysis'
  | 'Business Process Automation'
  | 'Code Scaffolding'
  | 'Code Quality & Review'
  | 'CI/CD & Deployment'
  | 'Operations Manual'
  | 'Infrastructure Operations';

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
  scenarios: string[];
  tags: string[];
  targetUsers: string;
}

export interface CategoryInfo {
  name: SkillCategory;
  displayName: string;
  count: number;
  color: string;
}
