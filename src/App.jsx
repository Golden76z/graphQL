import Header from './elements/layout/Header.jsx';
import Footer from './elements/layout/Footer.jsx';
import Card from './elements/components/cards/Cards.jsx';
import Button from './elements/components/button/Button.jsx';
import Student from './elements/components/Student.jsx';
import UserGreeting from './elements/components/UserGreeting.jsx';
import List from './elements/components/List.jsx';
import ProfilePicture from './elements/components/ProfilePicture.jsx';

function App() {

  const fruits = [
    {id: 1, name: 'Apple', calories: 52},
    {id: 2, name: 'Banana', calories: 89}, 
    {id: 3, name: 'Cherry', calories: 50},
    {id: 4, name: 'Date', calories: 282}, 
    {id: 5, name: 'Fig', calories: 74}
  ]

  return (
    <>
      <Header/>
      <UserGreeting isLoggedIn={true} username={"Golden"}/>
      {fruits.length > 0 && <List items={fruits} category={"Fruits"}/>}
      <Card/>
      <Button/>
      <ProfilePicture/>
      {/* <Student name="John Doe" age={30} isStudent={true}/>
      <Student name="Patrick" age={42} isStudent={false}/>
      <Student name="Squidward" age={50} isStudent={false}/>
      <Student name="Sandy" age={27} isStudent={true}/>
      <Student age={10}/> */}
      <Footer/>
    </>
  );
}

export default App;