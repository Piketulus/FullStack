const Numbers = ({showing, deletePerson}) => {
    return (
        <div>
            {showing.map((showing, i) => 
                <div key={i}>{showing.name} {showing.number} <button onClick={() => deletePerson(showing.id)}>delete</button></div>
                )}
        </div>
    )
}

export default Numbers