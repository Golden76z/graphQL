// Component for the footer of the app
function Footer() {
    return (
        <footer>
            {/* &cope; for copiright symple and year method in curly braces */}
            <p>&copy; {new Date().getFullYear()} graphQL Golden</p>
        </footer>
    );
}

export default Footer;