import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-sm">
        <h1 className="font-display text-6xl font-medium tracking-tight text-foreground mb-3">
          404
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          The requested page could not be found.
        </p>
        <Link
          to="/"
          className="text-sm text-foreground underline underline-offset-4 hover:text-signal transition-colors font-medium"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
