export type Resource = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  type: "guide" | "example" | "inspiration" | "reference" | "troubleshooting";
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type LinkItem = { label: string; url: string };

export type ResourceRow = {
  id?: string;
  title: string;
  slug: string;
  summary: string | null;
  content_md: string;
  type: string;
  level: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  links: LinkItem[];
};

export type ResourceFormProps = {
  initialValues?: Partial<ResourceRow>;
  onSubmit: (fields: ResourceRow) => Promise<void>;
  onDelete?: () => Promise<void>;
  resourceId?: string; // for the image upload path
};
