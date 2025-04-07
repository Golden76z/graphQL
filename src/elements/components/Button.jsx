import styles from '../../styles/components/Button.module.css'

function Button(props) {
    return (
        <button onClick={props.Function} className={styles.button}>
            {props.Name}
        </button>
    );
}

export default Button;