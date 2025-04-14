import PropTypes from "prop-types";
import { levelObject, checkLevel } from "../../../data/cardsData.js";

// React component for the level card
function LevelCard({cursus = "", xp = ""}) {
    const level = xp / 1000
    const title = levelObject[checkLevel(level)]

    return (
        <div>
            {}
            <h3></h3>
        </div>
    );
}

// Defining the type of the variables we take in the component
LevelCard.PropTypes = {
    cursus: PropTypes.string,
    xp:     PropTypes.string,
}

export default LevelCard;