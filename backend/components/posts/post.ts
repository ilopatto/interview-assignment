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

/**
 * Represents co_posts table in db
 */
export class Post implements PostDTO {
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

  constructor(dto: PostDTO) {
    Object.assign(this, dto);
  }
}