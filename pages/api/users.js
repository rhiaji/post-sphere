import { connectToDb } from './db'

const VALID_API_KEY = process.env.NEXT_PUBLIC_REACT_APP_API

export default async (req, res) => {
    try {
        const apiKey = req.headers['x-api-key']

        if (apiKey !== VALID_API_KEY) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        const db = await connectToDb()

        // Using async/await for readability
        if (req.method === 'POST') {
            const { action, data: userAccountData } = req.body

            if (action === 'Create User Account') {
                try {
                    const result = await db.collection('users').insertOne(userAccountData)
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
                const users = await db.collection('users').find().toArray()
                return res.status(200).json(users)
            } catch (error) {
                console.error('Error getting user data:', error)
                return res.status(500).json({ error: 'Could not get any Data' })
            }
        } else {
            return res.status(405).end() // Method Not Allowed for other HTTP methods
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}
