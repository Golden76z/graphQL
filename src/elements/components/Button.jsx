import styles from '../../styles/components/Button.module.css'
import PropTypes from 'prop-types';

// React component for the basic buttons of the website
function Button({Name = "Button", Function = () => {}}) {
    return (
        <button onClick={Function} className={styles.button}>
            {Name}
        </button>
    );
}

// Defining the type of variables we take
Button.prototype = {
    Function: PropTypes.function,
    Name:     PropTypes.string,
}

export default Button;