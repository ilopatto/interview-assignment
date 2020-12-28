import type { Pool } from 'pg'
import { Post, PostDTO } from './post'

export class PostDAL {
  constructor(private db: Pool) { }

  async getPostById(postId: number): Promise<Post | undefined> {
    const query = `
    SELECT post_id
      , description
      , type
      , status
      , data
      , reaction_count
      , impacter_id
      , published_at
      , created_at
      , updated_at
    FROM co_posts
    WHERE post_id = $1
    `;

    try {
      const result = await this.db.query<PostDTO>(
        query,
        [postId]
      );

      if (result.rowCount === 0) {
        return undefined;
      }

      return new Post(result.rows[0]);
    } catch (queryError) {
      throw queryError;
    }
  }

  async getAllPosts(
    { limit, offset }: { limit?: number, offset?: number }
  ): Promise<Post[] | undefined> {
    let query = `
      SELECT post_id
        , description
        , type
        , status
        , data
        , reaction_count
        , impacter_id
        , published_at
        , created_at
        , updated_at
      FROM co_posts
      ORDER BY post_id
      `;

    let queryParams = [];

    if (limit) {
      query += 'LIMIT $' + (queryParams.length + 1);
      query += '\n';
      queryParams.push(limit);
    }

    if (offset) {
      query += 'OFFSET $' + (queryParams.length + 1);
      queryParams.push(offset);
    }

    try {
      const result = await this.db.query<Post>(
        query,
        queryParams
      );

      if (result.rowCount === 0) {
        return undefined;
      }

      return result.rows.map(rawEntry => new Post(rawEntry));
    } catch (queryError) {
      throw queryError;
    }
  }

  async createPost(newPost: Post): Promise<boolean> {
    const query = `
    INSERT co_posts(
      description,
      type,
      status,
      data,
      reaction_count,
      impacter_id
    )
    VALUES (
      ${newPost.description},
      ${newPost.type},
      ${newPost.status},
      ${newPost.data},
      ${newPost.reaction_count},
      ${newPost.impacter_id},
    )`;

    try {
      const result = await this.db.query(query);

      if (result.rowCount === 1) {
        return true;
      } else {
        return false;
      }
    } catch (queryError) {
      throw queryError;
    }
  }

  async deletePost(postId: number): Promise<boolean> {
    const query = `
      DELETE FROM co_posts
      WHERE post_id = $1
    `;

    try {
      const result = await this.db
        .query(query, [postId]);
      
      if (result.rowCount === 0) {
        return false;
      } else {
        return true;
      }
    } catch (queryError) {
      throw queryError;
    }
  }
}