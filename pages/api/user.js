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
                const data = await db.collection('users').findOne({ username: account })
                return res.status(200).json([data])
            } catch (error) {
                console.error('Error getting user data:', error)
                return res.status(500).json({
                    error: 'Could not get any Data',
                    details: error.message,
                })
            }
        } else if (req.method === 'PATCH') {
            const userId = req.body.userId
            const userData = req.body.image
            const content = req.body.content

            try {
                if (ObjectId.isValid(userId)) {
                    let updateField
                    if (content === 'profile photo') {
                        updateField = 'images.profile'
                    } else if (content === 'cover photo') {
                        updateField = 'images.cover'
                    } else {
                        return res.status(400).json({ error: 'Invalid content for profile update' })
                    }

                    const result = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: { [updateField]: userData } })

                    if (result.matchedCount > 0) {
                        return res.status(200).json(result)
                    } else {
                        return res.status(404).json({ error: `Error ${content} update` })
                    }
                } else {
                    return res.status(400).json({ error: 'Invalid userId' })
                }
            } catch (error) {
                console.error(`Error updating ${content}:`, error)
                return res.status(500).json({
                    error: `Could not update ${content}`,
                    details: error.message,
                })
            }
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}
