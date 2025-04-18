import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query
  const response = await fetch(`${process.env.WP_API_URL}/${slug}`)
  const data = await response.json()
  res.status(200).json(data)
}