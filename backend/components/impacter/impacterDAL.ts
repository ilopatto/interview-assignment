import type { Pool } from 'pg'
import { ImpacterDTO, Impacter } from './impacter'

export class ImpacterDAL {
  constructor(private db: Pool) {}

  async getImpacterById(impacterId: number): Promise<Impacter | undefined> {
    const query = `
    SELECT impacter_id
      , name
      , bio
      , profile_image
      , image
      , status
      , created_at
      , updated_at
    FROM co_impacters
    WHERE impacter_id = $1
    `;

    try {
      const result = await this.db.query<ImpacterDTO>(
        query,
        [impacterId]
      );

      return result.rowCount
        ? new Impacter(result.rows[0])
        : undefined;
    } catch (queryError) {
      throw queryError;
    }
  }

  async getAllImpacters(): Promise<Impacter[] | undefined> {
    const query = `
    SELECT impacter_id
      , name
      , bio
      , profile_image
      , image
      , status
      , created_at
      , updated_at
    FROM co_impacters
    ORDER BY impacter_id
    `;

    try {
      const result = await this.db.query<ImpacterDTO>(
        query
      );

      return result.rowCount === 0
        ? undefined
        : result.rows.map(impacterDTO => new Impacter(impacterDTO));
    } catch (queryError) {
      throw queryError;
    }
  }
}