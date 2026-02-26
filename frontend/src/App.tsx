import { Button } from "./components/ui/button";
import "./App.css";
import { ModeToggle } from "./components/shared/ModeToggle";

const App = () => {
  return (
    <div>
      <p>App</p>
      <Button>Click me</Button>
      <ModeToggle />
    </div>
  );
};
export default App;
