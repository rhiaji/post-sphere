const apikey = process.env.NEXT_PUBLIC_REACT_APP_API
const apiUrl = 'https://post-sphere-rhiaji.vercel.app/api' // http://localhost:3000/api or your sitename

// Generic function to handle fetching data from the server
async function handleFetch(url, method, data) {
    // Construct the full URL by combining the base API URL and the provided endpoint
    const response = await fetch(`${apiUrl}/${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apikey,
        },
        body: data ? JSON.stringify(data) : undefined,
    })

    // Check if the response is successful; otherwise, throw an error
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }

    // Parse and return the JSON data from the response
    return response.json()
}

// Fetches all posts from the server
export async function getPosts() {
    return handleFetch('posts', 'GET')
}

// Creates a new post on the server
export async function createPost(postData) {
    return handleFetch('posts', 'POST', postData)
}

// Adds a new comment to a post on the server
export async function createComment(commentData) {
    return handleFetch('posts', 'PATCH', commentData)
}

// Deletes a comment on a post for the current user
export async function deleteUserComment(deleteData) {
    return handleFetch('posts', 'DELETE', deleteData)
}

// Updates the content of a comment for the current user
export async function updateUserComment(updateData) {
    return handleFetch('posts', 'PATCH', updateData)
}

// Fetches all user data from the server
export async function getUsers() {
    return handleFetch('users', 'GET')
}

// Fetches user account data for a specific user
export async function getAccount(user) {
    return handleFetch(`user?account=${user}`, 'GET')
}

// Updates user account information
export async function updateAccount(jsonData) {
    return handleFetch('user', 'PATCH', jsonData)
}

// Fetches posts for a specific user
export async function getUserPost(user) {
    return handleFetch(`post?account=${user}`, 'GET')
}

// Updates the content of a user's post
export async function updateUserPost(postData) {
    return handleFetch('post', 'PATCH', postData)
}

// Deletes a post for the current user
export async function deleteUserPost(deleteData) {
    return handleFetch('post', 'DELETE', deleteData)
}

// Creates a new user account
export async function createAccount(createData) {
    return handleFetch('users', 'POST', createData)
}
