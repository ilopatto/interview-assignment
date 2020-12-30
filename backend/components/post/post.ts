/**
 * Represents co_posts table in db
 */
export interface PostDTO {
  post_id: number;
  description: string;
  type: string;
  status: string;
  data: any;
  reaction_count: number;
  impacter_id: number;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
}

export enum PostType {
  IMAGES = 'IMAGES',
  TEXT = 'TEXT',
  VIDEOS = 'VIDEOS',
  STORY = 'STORY'
}

export enum PostStatus {
  VISIBLE = 'VISIBLE',
  HIDDEN = 'HIDDEN',
  DELETED = 'DELETED'
}

/**
 * Represents co_posts table in db
 */
export class Post implements PostDTO {
  post_id: number;
  description: string;
  type: PostType;
  status: PostStatus;
  data: any;
  reaction_count: number;
  impacter_id: number;
  published_at: Date;
  created_at: Date;
  updated_at: Date;

  constructor(dto: PostDTO) {
    Object.assign(this, dto);
  }
}