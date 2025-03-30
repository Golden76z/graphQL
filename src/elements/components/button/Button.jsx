import styles from './Button.module.css';

// Function to display a button
function Button() {
    const handleClick = () => console.log('Button clicked!');
    const handleClick2 = (name) => console.log(`${name} clicked!`);

    return (
        <button onClick={() => handleClick2("Golden")} className={styles.button}>Click me</button>
    );
}

export default Button;