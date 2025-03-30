function ProfilePicture() {
    const imageUrl = "../src/assets/profilepic.jpg"

    const handleClick = () => { console.log("test") }

    return (
        <img onClick={handleClick} src={imageUrl} alt="" />
    )
}

export default ProfilePicture;