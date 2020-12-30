import type { NextApiRequest, NextApiResponse } from 'next'
import Joi from 'joi'
import { pool } from "@db"
import { Post, PostDAL, PostStatus, PostType } from '@components/post'

type AvailableMethodResolvers = 'GET' | 'POST';

interface PostsQueryParams {
  limit?: number;
  offset?: number;
}

const postsQueryParamsValidator = Joi.object<PostsQueryParams>({
  limit: Joi.number().min(0),
  offset: Joi.number().min(0)
});

export default async function postsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method as AvailableMethodResolvers) {
    case 'GET':
      return await get(req, res);
      break;
    case 'POST':
      return await post(req, res);
      break;
    default:
      res.setHeader('Allow', 'GET,POST');
      return res
        .status(405)
        .json({
          message: 'Wrong HTTP method'
        });
      break;
  }
}

async function get(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let { limit, offset } = req.query;

    const validationResult = postsQueryParamsValidator.validate({
      limit,
      offset
    });

    if (validationResult.error) {
      return res.status(400).json({
        message: 'Bad query parameters'
      });
    }

    const queryParams: PostsQueryParams = validationResult.value;

    const postDAL = new PostDAL(pool);
    const posts = await postDAL.getAllPosts(queryParams);

    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
  }

  return res.status(500).json({
    message: 'Something went wrong'
  });
}

const postObjectValidator = Joi.object({
  description: Joi.string().max(512).default(''),
  type: Joi.string().valid(...Object.keys(PostType)).required(),
  status: Joi.string().valid(...Object.keys(PostStatus)).required(),
  data: Joi.object().required(),
  impacter_id: Joi.number().required()
})

async function post(req: NextApiRequest, res: NextApiResponse) {
  const validationResult = postObjectValidator.validate(req.body);

  if (validationResult.error) {
    return res
      .status(404)
      .json({
        message: `Error: ${validationResult.error.name}`
      });
  }

  return res
    .json(validationResult.value);

  return res
    .status(501)
    .json({
      message: 'Not implemented yet'
    })
}