import { ObjectId } from 'mongodb'
import { connectToDb } from './db'

const VALID_API_KEY = process.env.NEXT_PUBLIC_REACT_APP_API

export default async (req, res) => {
    try {
        const apiKey = req.headers['x-api-key']

        if (apiKey !== VALID_API_KEY) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        const db = await connectToDb()

        if (req.method === 'GET') {
            const account = req.body.username || req.query.account

            try {
                const data = await db.collection('posts').find({ 'author.username': account }).sort({ timestamp: -1 }).toArray()
                return res.status(200).json(data)
            } catch (error) {
                console.error('Error getting user data:', error)
                return res.status(500).json({
                    error: 'Could not get any Data',
                    details: error.message,
                })
            }
        } else if (req.method === 'PATCH') {
            const postId = req.body.postId
            const postData = req.body.content

            try {
                if (!ObjectId.isValid(postId)) {
                    return res.status(400).json({ error: 'Invalid postId' })
                }

                const result = await db.collection('posts').updateOne({ _id: new ObjectId(postId) }, { $set: { content: postData } })

                if (result.matchedCount > 0) {
                    return res.status(200).json(result)
                } else {
                    return res.status(404).json({ error: 'Post not found' })
                }
            } catch (error) {
                console.error('Error updating post data:', error)
                return res.status(500).json({
                    error: 'Could not update post data',
                    details: error.message,
                })
            }
        } else if (req.method === 'DELETE') {
            const postId = req.body.postId

            try {
                if (!ObjectId.isValid(postId)) {
                    return res.status(400).json({ error: 'Invalid postId' })
                }

                const result = await db.collection('posts').deleteOne({ _id: new ObjectId(postId) })

                if (result.deletedCount > 0) {
                    return res.status(200).json({ message: 'Post deleted successfully' })
                } else {
                    return res.status(404).json({ error: 'Post not found' })
                }
            } catch (error) {
                console.error('Error deleting post data:', error)
                return res.status(500).json({
                    error: 'Could not delete post data',
                    details: error.message,
                })
            }
        } else {
            return res.status(405).end()
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}
