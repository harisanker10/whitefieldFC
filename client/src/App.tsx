import { Link } from "react-router";
import { Button } from "./components/ui/button";

function App() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1>Whitefield FC </h1>
      <Link to="/admin/coaches">
        <Button variant="outline"> Admin Panel </Button>
      </Link>
    </main>
  );
}

export default App;
