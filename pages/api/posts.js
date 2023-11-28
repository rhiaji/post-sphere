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

        if (req.method === 'POST') {
            const action = req.body.action
            const userData = req.body.data

            if (action === 'Create Post') {
                try {
                    const result = await db.collection('posts').insertOne(userData)
                    return res.status(201).json(result)
                } catch (error) {
                    console.error('Error creating a new user data:', error)
                    return res.status(500).json({
                        error: 'Could not create a new user data',
                        details: error.message,
                    })
                }
            }
        } else if (req.method === 'GET') {
            try {
                const users = await db.collection('posts').find().sort({ timestamp: -1 }).toArray()
                return res.status(200).json(users)
            } catch (error) {
                console.error('Error getting user data:', error)
                return res.status(500).json({
                    error: 'Could not get any Data',
                    details: error.message,
                })
            }
        } else if (req.method === 'PATCH' || req.method === 'DELETE') {
            const action = req.body.action
            const postId = req.body.data.postId
            const commentData = req.body.data

            try {
                if (!ObjectId.isValid(postId)) {
                    return res.status(400).json({ error: 'Invalid postId' })
                }

                let result
                if (action === 'Create Comment') {
                    result = await db.collection('posts').updateOne({ _id: new ObjectId(postId) }, { $push: { comments: commentData } })
                } else if (action === 'Update Comment') {
                    result = await db
                        .collection('posts')
                        .updateOne(
                            { _id: new ObjectId(postId), 'comments.commentId': commentData.commentId },
                            { $set: { 'comments.$.content': commentData.content } }
                        )
                } else if (action === 'Delete Comment') {
                    result = await db
                        .collection('posts')
                        .updateOne({ _id: new ObjectId(postId) }, { $pull: { comments: { commentId: commentData.commentId } } }, { multi: true })
                }

                if (result.matchedCount > 0) {
                    return res.status(200).json(result)
                } else {
                    return res.status(404).json({ error: 'Post not found or operation failed' })
                }
            } catch (error) {
                console.error('Error updating/deleting post data:', error)
                return res.status(500).json({
                    error: 'Could not update/delete post data',
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
