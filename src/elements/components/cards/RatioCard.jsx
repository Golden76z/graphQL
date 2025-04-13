import PropTypes from "prop-types";

// Audit ratio react element
function RatioCard({Given = 0, Received = 0}) {

    // const auditRatio = Given - Received + 1

    return (
        <div>
            <h2>Audits ratio</h2>
            <p>Done</p>
            <p>{Given} MB</p>
            <p>Received</p>
            <p>{Received} MB</p>

            <h1></h1>
        </div>
    );
}

// Proptypes of the ratio element card
RatioCard.PropTypes = {
    Given:      PropTypes.integer,
    Received:   PropTypes.integer,
}

export default RatioCard;