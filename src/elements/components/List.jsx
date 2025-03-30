// Function to display a list of items
function List(props) {
    let items = props.items || []

    items.sort((a, b) => a.name.localeCompare(b.name))
    const listItems = items.map(item => <li key={item.id}>{item.name}, calories: {item.calories}</li>)

    return (
        <>
            <h3 className="list_title">{props.category}</h3>
            <ol className="list_items">{listItems}</ol>
        </>
    )
}

export default List;