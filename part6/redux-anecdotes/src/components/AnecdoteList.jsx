import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'


const AnecdoteList = () => {
    const anecdotes = useSelector(state => state)
    const dispatch = useDispatch()

    const anecdotesList = [...anecdotes].sort((a, b) => {
        return b.votes - a.votes
    })

    const voteID = (id) => {
        dispatch(vote(id))
    }

    return (
        <div>
            <h2>Anecdotes</h2>
            {anecdotesList.map(anecdote =>
                <div key={anecdote.id}>
                <div>
                    {anecdote.content}
                </div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => voteID(anecdote.id)}>vote</button>
                </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList