const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (favorite, item) => {
        return favorite.likes > item.likes ? favorite : item
    }
    return blogs.reduce(reducer, {})
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const authors = blogs.map(blog => blog.author)

    const authorCount = {}

    blogs.forEach(blog => {
        if (authorCount[blog.author]) {
            authorCount[blog.author] += 1
        } else {
            authorCount[blog.author] = 1
        }
    })

    const reducer = (most, author) => {
        return most.blogs > authorCount[author] ? most : { author: author, blogs: authorCount[author] }
    }

    const answer = authors.reduce(reducer, { author: '', blogs: 0})

    if (answer.blogs === 0) {
        return {}
    }

    return answer
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const authors = blogs.map(blog => blog.author)

    const authorCount = {}

    blogs.forEach(blog => {
        if (authorCount[blog.author]) {
            authorCount[blog.author] += blog.likes
        } else {
            authorCount[blog.author] = blog.likes
        }
    })

    const reducer = (most, author) => {
        return most.likes > authorCount[author] ? most : { author: author, likes: authorCount[author] }
    }

    const answer = authors.reduce(reducer, { author: '', likes: 0})

    if (answer.author === '') {
        return {}
    }

    return answer
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}