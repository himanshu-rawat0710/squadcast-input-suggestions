import './App.css'

import Mention from '../components/Mention';
import data from '../data.json';

const App: React.FC = () => {
  const handleMentionSelect = (selectedOption: string) => {
    console.log('Selected:', selectedOption);
    // Here you can use the selectedOption as needed (e.g., append it to the input value)
  };

  return (
    <div>
      <h1>@-Mentions</h1>
      <Mention data={data} onMentionSelect={handleMentionSelect} />
    </div>
  );
};

export default App;
