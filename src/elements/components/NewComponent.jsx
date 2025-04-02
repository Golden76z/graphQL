import React, { useState } from 'react';

function NewComponent() {
    const [name, setName] = useState('Guest');
    const [age, setAge] = useState(0);
    const [status, setStatus] = useState(false);

    const updateName = () => {
        setName('Spongebob')
    }

    const updateAge = () => {
        setAge(age + 1)
    }

    const updateStatus = () => {
        setStatus(!status)
    }

    return (
        <div>
            <p>Name: {name}</p>
            <button onClick={updateName}>Set name</button>

            <p>Age: {age}</p>
            <button onClick={updateAge}>Increment age</button>

            <p>Is online: {status ? "True" : "False"}</p>
            <button onClick={updateStatus}>Switch</button>
        </div>
    );
}

export default NewComponent