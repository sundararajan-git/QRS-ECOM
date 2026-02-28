import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-semibold">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    </div>
  );
};

export default NotFound;
